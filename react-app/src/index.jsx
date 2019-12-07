import React from "react";
import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

function buildQuery(object) {
  const items = Object.keys(object).map(
    (key) =>
      `${key}=${object[key]}`
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
    <InputGroup className="mb-3">
      <FormControl
        onChange={props.onChange}
        placeholder="Search all fields"
        aria-label="Search"
        aria-describedby="basic-addon2"
      />
      <InputGroup.Append>
        <Button variant="outline-secondary">Search</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

class FilterSet extends React.Component {
  constructor(props) {
    super(props);

    this.filterKeys = props.schema.filter(
      (field) => field.filterKey
    ).map(
      (field) => field.filterKey
    );
    const filterEntries = this.filterKeys.map(
      (key) => [key, ""]
    );

    this.state = {
      filters: Object.fromEntries(filterEntries),
    };
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  handleFiltersChange(e) {
    const filterKey = e.target.name;
    const filterValue = e.target.value;
    const filters = Object.assign({}, this.state.filters);

    filters[filterKey] = filterValue;

    this.setState({
      filters: filters,
    });
    this.props.onFiltersChange(filters);
  }

  render() {
    return (
      <Card body>
        <Card.Title>Filters</Card.Title>
        {this.props.schema.map(
          (field) => field.filterKey &&
            <Form.Group key={field.filterKey}>
              <Form.Label>{field.name}</Form.Label>
              <Form.Control
                name={field.filterKey}
                placeholder={`Filter on ${field.name}`}
                onChange={this.handleFiltersChange}
              />
            </Form.Group>
        )}
        <SearchBox onChange={this.props.onSearchStringChange} />
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
          onClick={(e) => props.onClick(e, newSortKey)}
        >
          {label}
        </button>
      ) : label}
    </th>
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
      totalRecords: null,
      sortKey: "",
      searchString: "",
      filters: {},
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  fetch(limit, offset, sortKey, searchString, filters) {
    let query = {
      limit: limit,
      offset: offset,
      ordering: sortKey,
      search: searchString,
    };
    query = Object.assign(query, filters);
    const queryString = buildQuery(query);
    const url = `${this.props.recordsUrl}?${queryString}`;
    console.log(url);
    return fetch(url)
      .then(response => response.json())
      .then(data => this.setState({
        currentRecords: data.results,
        totalRecords: data.count,
      }));
  }

  componentDidMount() {
    this.fetch(
      this.recordsPerPage,
      this.state.currentOffset,
      this.state.sortKey,
      this.state.searchString,
      this.state.filters,
    );
  }

  handlePageChange(page) {
    if (page < 1) {
      return;
    }
    const offset = (page - 1) * this.recordsPerPage;

    this.fetch(
      this.recordsPerPage,
      offset,
      this.state.sortKey,
      this.state.searchString,
      this.state.filters,
    ).then(() => this.setState({
      currentPage: page,
      currentOffset: offset,
    }));
  }

  handleSortChange(e, sortKey) {
    e.preventDefault();
    this.fetch(
      this.recordsPerPage,
      this.state.currentOffset,
      sortKey,
      this.state.searchString,
      this.state.filters,
    ).then(() => this.setState({
      sortKey: sortKey,
    }));
  }

  handleSearchStringChange(e) {
    const searchString = e.target.value;
    this.fetch(
      this.recordsPerPage,
      this.state.currentOffset,
      this.state.sortKey,
      searchString,
      this.state.filters,
    ).then(() => this.setState({
      searchString: searchString,
    }));
  }

  handleFiltersChange(filters) {
    this.fetch(
      this.recordsPerPage,
      this.state.currentOffset,
      this.state.sortKey,
      this.state.searchString,
      filters,
    ).then(() => this.setState({
      filters: filters,
    }));
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <FilterSet
              schema={this.props.schema}
              onFiltersChange={this.handleFiltersChange}
              onSearchStringChange={this.handleSearchStringChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
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
                  (record, index) =>
                    <tr key={record.id}>
                      <th scope="row">{index+this.state.currentOffset+1}</th>
                      {this.props.schema.map(
                        (item) =>
                          <td key={item.key}>
                            {item.render ?
                             item.render(record[item.key]) :
                             record[item.key]}
                          </td>
                      )}
                    </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </Container>
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

  return <DataTable
           schema={schema}
           recordsUrl="http://127.0.0.1:8000/tracks-table/"
         />;
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
