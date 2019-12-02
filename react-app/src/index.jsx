import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Paginator(props) {
  const numPages = Math.ceil(props.totalRecords / props.recordsPerPage);
  const currentPage = Math.floor(props.currentOffset / props.recordsPerPage) + 1;

  var buttons = [];
  buttons.push(
    <button
      key="previous"
      className="button button-outline"
      onClick={() => props.onPageChange(props.currentOffset-props.recordsPerPage)}
    >
      «
    </button>
  );

  if (currentPage !== 1) {
    buttons.push(
      <button
        key="first"
        className="button button-outline"
        onClick={() => props.onPageChange(0)}
      >
        1
      </button>
    );
  }

  buttons.push(
    <button key={currentPage} className="button">
      {currentPage}
    </button>
  );

  if (currentPage !== numPages) {
    buttons.push(
      <button
        key="last"
        className="button button-outline"
        onClick={() => props.onPageChange((numPages-1)*props.recordsPerPage)}
      >
        {numPages}
      </button>
    );
  }

  buttons.push(
    <button
      key="next"
      className="button button-outline"
      onClick={() => props.onPageChange(props.currentOffset+props.recordsPerPage)}
    >
      »
    </button>
  );

  return (
    <div className="paginator">
      {buttons}
    </div>
  );
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.recordsPerPage = 15;

    this.state = {
      currentRecords: [],
      currentOffset: 0,
      totalRecords: null,
    };
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

  handlePageChange(offset) {
    console.log(offset);
    var correctedOffset = Math.max(0, offset);
    correctedOffset = Math.min(
      correctedOffset,
      this.state.totalRecords
    );

    this.fetch(this.recordsPerPage, correctedOffset)
      .then(() => this.setState({
        currentOffset: correctedOffset,
      }));
  }

  render() {
    return (
      <div>
        <table>
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
                <tr key={record.url}>
                  <th scope="row">{index+this.state.currentOffset+1}</th>
                  {this.props.schema.map(
                    (item) =>
                      <td key={item.key}>{record[item.key]}</td>
                  )}
                </tr>
            )}
          </tbody>
        </table>
        <Paginator currentOffset={this.state.currentOffset}
                   totalRecords={this.state.totalRecords}
                   recordsPerPage={this.recordsPerPage}
                   onPageChange={i => this.handlePageChange(i)}
        />
      </div>
    );
  }
}

function App(props) {
  const schema = [
    {
      key: "url",
      name: "URL",
    },
    {
      key: "name",
      name: "Name",
    },
    {
      key: "composer",
      name: "Composer",
    },
    {
      key: "album",
      name: "Album",
    },
    {
      key: "milliseconds",
      name: "Length",
    },
  ];

  return <Table
           schema={schema}
           recordsUrl="http://127.0.0.1:8000/tracks/"
         />;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
