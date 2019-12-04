import React from "react";
import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

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
        <a href="#" onClick={() => props.onClick(newSortKey)}>
          {label}
        </a>
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
      sortKey: null,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  fetch(limit, offset, sortKey) {
    let url = `${this.props.recordsUrl}?limit=${limit}`
        + `&offset=${offset}`;
    if (sortKey) {
      url += `&ordering=${sortKey}`;
    }
    console.log(url);
    return fetch(url)
      .then(response => response.json())
      .then(data => this.setState({
        currentRecords: data.results,
        totalRecords: data.count,
      }));
  }

  componentDidMount() {
    this.fetch(this.recordsPerPage, this.state.currentOffset);
  }

  handlePageChange(page) {
    if (page < 1) {
      return;
    }
    const offset = (page - 1) * this.recordsPerPage;

    this.fetch(this.recordsPerPage, offset, this.state.sortKey)
      .then(() => this.setState({
        currentPage: page,
        currentOffset: offset,
      }));
  }

  handleSortChange(sortKey) {
    this.fetch(this.recordsPerPage, this.state.currentOffset, sortKey)
      .then(() => this.setState({
        sortKey: sortKey,
      }));
  }

  render() {
    return (
      <Container>
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
                    onClick={(sortKey) => this.handleSortChange(sortKey)}
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
                      <td key={item.key}>{record[item.key]}</td>
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
    },
    {
      key: "name",
      name: "Name",
      sortKey: "name",
    },
    {
      key: "album",
      name: "Album",
      sortKey: "album__title",
    },
    {
      key: "milliseconds",
      name: "Length",
      sortKey: "milliseconds",
    },
    {
      key: "genre",
      name: "Genre",
      sortKey: null,
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
