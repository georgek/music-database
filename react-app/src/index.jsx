import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { QueryParamProvider } from "use-query-params";

import Container from "react-bootstrap/Container";

import DataTable from "./newdatatable.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function displayLength(milliseconds) {
  milliseconds = parseInt(milliseconds, 10);
  const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60).toString();
  const seconds = Math.ceil(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
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
      key: "artist",
      name: "Artist",
      sortKey: "album__artist__name",
    },
    {
      key: "milliseconds",
      name: "Length",
      sortKey: "milliseconds",
      render: displayLength,
    },
    {
      key: "genre",
      name: "Genre",
      sortKey: null,
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
      key: "album",
      type: "search",
    },
    {
      name: "Artist",
      key: "artist",
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
        availableFilters={filters}
        recordsUrl="http://127.0.0.1:8000/tracks-table/"
      />
    </Container>
  );
}

ReactDOM.render(
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <App />
    </QueryParamProvider>
  </Router>,
  document.getElementById("root")
);
