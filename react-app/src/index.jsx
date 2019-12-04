import React from "react";
import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.recordsPerPage = 10;

    this.state = {
      currentRecords: [],
      currentPage: 1,
      currentOffset: 0,
      totalRecords: null,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  fetch(limit, offset) {
    let url = `${this.props.recordsUrl}?limit=${limit}`
        + `&offset=${offset}`;
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

    this.fetch(this.recordsPerPage, offset)
      .then(() => this.setState({
        currentPage: page,
        currentOffset: offset,
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
                  <th key={item.key} scope="col">{item.name}</th>
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
    },
    {
      key: "name",
      name: "Name",
    },
    {
      key: "album",
      name: "Album",
    },
    {
      key: "milliseconds",
      name: "Length",
    },
    {
      key: "genre",
      name: "Genre",
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
