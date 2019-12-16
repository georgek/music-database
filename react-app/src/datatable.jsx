import React from "react";

import Pagination from "react-js-pagination";

import AwesomeDebouncePromise from 'awesome-debounce-promise';

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import FilterSet from "./filters.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function buildQuery(object) {
  const items = Object.keys(object).map(
    (key) =>
      `${key}=${encodeURIComponent(object[key])}`
  );
  return items.join("&");
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

export default class DataTable extends React.Component {
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
          Showing {this.state.currentRecords.length} of
          {" "}{this.state.totalRecords} records.
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
