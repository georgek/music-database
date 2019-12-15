import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import Pagination from "react-js-pagination";

import AwesomeDebouncePromise from 'awesome-debounce-promise';

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Table from "react-bootstrap/Table";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function buildQuery(object) {
  const items = Object.keys(object).map(
    (key) =>
      `${key}=${encodeURIComponent(object[key])}`
  );
  return items.join("&");
}

function displayLength(milliseconds) {
  milliseconds = parseInt(milliseconds, 10);
  const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60).toString();
  const seconds = Math.ceil(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function SearchBox(props) {
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
          name={props.name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          aria-label={props.label}
          aria-describedby="basic-addon2"
        />
        {props.value &&
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => props.onChange("")}
            >
              Clear
            </Button>
          </InputGroup.Append>}
      </InputGroup>
    </Form.Group>
  );
}

function ChoiceBox(props) {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    console.log(props.choicesUrl);
    fetch(props.choicesUrl)
      .then(response => response.json())
      .then(data => setChoices(data.results));
  }, [props.choicesUrl]);

  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
          as="select"
          name={props.name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          aria-label={props.label}
          aria-describedby="basic-addon2"
        >
          <option value="">(All)</option>
          {choices.map(
            (choice) =>
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
          )}
        </FormControl>
      </InputGroup>
    </Form.Group>
  );
}

class FilterSet extends React.Component {
  constructor(props) {
    super(props);

    this.filterKeys = props.filters.map(
      (field) => field.key
    );
    const filterEntries = this.filterKeys.map(
      (key) => [key, ""]
    );

    this.state = {
      filters: Object.fromEntries(filterEntries),
      searchString: "",
    };
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
  }

  handleFiltersChange(key, value) {
    const filters = Object.assign({}, this.state.filters);

    filters[key] = value;

    this.setState({
      filters: filters,
    });
    this.props.onFiltersChange(filters);
  }

  handleSearchStringChange(value) {
    this.setState({
      searchString: value,
    });
    this.props.onSearchStringChange(value);
  }

  render() {
    return (
      <Card body>
        <Card.Title>Filters</Card.Title>
        <Form>
          {this.props.filters.map(
            (field) => {
              switch (field.type) {
              case "search":
                return (
                  <SearchBox
                    key={field.key}
                    name={field.key}
                    label={field.name}
                    value={this.state.filters[field.key]}
                    placeholder={`Filter on ${field.name}`}
                    onChange={
                      (value) => this.handleFiltersChange(field.key, value)
                    }
                  />
                );
              case "choice":
                return (
                  <ChoiceBox
                    key={field.key}
                    name={field.key}
                    label={field.name}
                    choicesUrl={field.choicesUrl}
                    value={this.state.filters[field.key]}
                    onChange={
                      (value) => this.handleFiltersChange(field.key, value)
                    }
                  />
                );
              default:
                return null;
              }
            }
          )}
        </Form>
      </Card>
    );
  }
}

function TableHeaderItem(props) {
  var label = props.name;
  var newSortKey = props.sortKey;
  if (props.sortedAsc) {
    label += " ▴";
    newSortKey = "-" + props.sortKey;
  } else if (props.sortedDesc) {
    label += " ▾";
    newSortKey = "";
  }
  return (
    <th scope="col">
      {props.sortKey ? (
        <button
          className="btn btn-link thead" href="#"
          onClick={
            (e) => {
              e.preventDefault();
              props.onClick(newSortKey);
            }}
        >
          {label}
        </button>
      ) : label}
    </th>
  );
}

function TableItem(props) {
  const value = props.render
        ? props.render(props.value)
        : props.value;
  if (props.schemaKey === "id") {
    return (
      <th scope="row">{value}</th>
    );
  }
  return (
    <td>{value}</td>
  );
}

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.recordsPerPage = 10;

    this.state = {
      currentRecords: [],
      currentPage: 1,
      currentOffset: 0,
      totalRecords: 0,
      sortKey: "",
      searchString: "",
      filters: {},
      loading: true,
    };

    this.fetch = this.fetch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  fetch(url, limit, offset, sortKey, searchString, filters) {
    let query = {
      limit: limit,
      offset: offset,
      ordering: sortKey,
      search: searchString,
    };
    query = Object.assign(query, filters);
    const queryString = buildQuery(query);
    const fullUrl = `${url}?${queryString}`;
    console.log(fullUrl);
    return fetch(fullUrl);
  }

  fetchDebounced = AwesomeDebouncePromise(this.fetch, 300);

  async updateState(updatedState, instant=false) {
    this.setState(updatedState);
    this.setState({loading: true});
    let newState = Object.assign({}, this.state);
    newState = Object.assign(newState, updatedState);
    const fetchFun = instant ? this.fetch : this.fetchDebounced;
    const response = await fetchFun(
      this.props.recordsUrl,
      this.recordsPerPage,
      newState.currentOffset,
      newState.sortKey,
      newState.searchString,
      newState.filters,
    );
    const data = await response.json();
    this.setState({
      currentRecords: data.results,
      totalRecords: data.count,
      loading: false,
    });
  }

  componentDidMount() {
    this.fetch(
      this.props.recordsUrl,
      this.recordsPerPage,
      this.state.currentOffset,
      this.state.sortKey,
      this.state.searchString,
      this.state.filters,
    )
      .then(response => response.json())
      .then(data => this.setState({
        currentRecords: data.results,
        totalRecords: data.count,
        loading: false,
      }));
  }

  componentDidUpdate() {
    // change page in case the current page is no longer valid after the
    // filters changed (ie. there are fewer records now than there were)
    this.handlePageChange(this.state.currentPage);
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  handlePageChange(page) {
    const totalPages = Math.ceil(
      this.state.totalRecords / this.recordsPerPage
    );
    if (totalPages === 0) {
      page = 1;
    } else if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    if (page === this.state.currentPage) {
      return;
    }

    const offset = (page - 1) * this.recordsPerPage;

    this.updateState(
      {
        currentPage: page,
        currentOffset: offset,
      },
      true,
    );
  }

  handleSortChange(sortKey) {
    this.updateState(
      {
        sortKey: sortKey,
      },
      true,
    );
  }

  handleSearchStringChange(string) {
    this.updateState({
      searchString: string,
    });
  }

  handleFiltersChange(filters) {
    this.updateState({
      filters: filters,
    });
  }

  render() {
    return (
      <>
        <FilterSet
          filters={this.props.filters}
          onFiltersChange={this.handleFiltersChange}
          onSearchStringChange={this.handleSearchStringChange}
        />
        <Card body>
          Showing {this.state.currentRecords.length}
          of {this.state.totalRecords} records.
        </Card>
        <Table
          striped
          hover
          className={this.state.loading && "loading"}
        >
          <thead>
            <tr>
              {this.props.schema.map(
                (item) =>
                  <TableHeaderItem
                    key={item.sortKey}
                    name={item.name}
                    sortKey={item.sortKey}
                    sortedAsc={this.state.sortKey === item.sortKey}
                    sortedDesc={this.state.sortKey === "-" + item.sortKey}
                    onClick={this.handleSortChange}
                  />
              )}
            </tr>
          </thead>
          <tbody>
            {this.state.currentRecords.map(
              (record) =>
                <tr key={record.id}>
                  {this.props.schema.map(
                    (item) =>
                      <TableItem
                        key={item.key}
                        schemaKey={item.key}
                        value={record[item.key]}
                        render={item.render}
                      />
                  )}
                </tr>
            )}
          </tbody>
        </Table>
        <nav aria-label="Table pagination">
          <Pagination
            onChange={this.handlePageChange}
            activePage={this.state.currentPage}
            itemsCountPerPage={this.recordsPerPage}
            totalItemsCount={this.state.totalRecords}
            pageRangeDisplayed="5"
            innerClass="pagination justify-content-center"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="active"
            disabledClass="disabled"
            prevPageText="‹"
            nextPageText="›"
          />
        </nav>
      </>
    );
  }
}

function App(props) {
  const schema = [
    {
      key: "id",
      name: "ID",
      sortKey: "id",
      filterKey: null,
    },
    {
      key: "name",
      name: "Name",
      sortKey: "name",
      filterKey: "name",
    },
    {
      key: "album",
      name: "Album",
      sortKey: "album__title",
      filterKey: "album__title",
    },
    {
      key: "artist",
      name: "Artist",
      sortKey: "album__artist__name",
      filterKey: "album__artist__name",
    },
    {
      key: "milliseconds",
      name: "Length",
      sortKey: "milliseconds",
      filterKey: null,
      render: displayLength,
    },
    {
      key: "genre",
      name: "Genre",
      sortKey: null,
      filterKey: null,
    },
  ];
  const filters = [
    {
      name: "Name",
      key: "name",
      type: "search",
    },
    {
      name: "Album",
      key: "album__title",
      type: "search",
    },
    {
      name: "Artist",
      key: "album__artist__name",
      type: "search",
    },
    {
      name: "Genre",
      key: "genre",
      type: "choice",
      choices: [],
      choicesUrl: "http://127.0.0.1:8000/genres/",
    },
    {
      name: "All fields",
      key: "search",
      type: "search",
    },
  ];

  return (
    <Container>
      <DataTable
        schema={schema}
        filters={filters}
        recordsUrl="http://127.0.0.1:8000/tracks-table/"
      />
    </Container>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
