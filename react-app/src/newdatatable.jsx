import React, { useEffect, useState } from "react";

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

export default function DataTable(props) {
  const recordsPerPage = 10;
  const [currentRecords, setCurrentRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortKey, setSortKey] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = {
      limit: recordsPerPage,
      offset:(currentPage - 1) * recordsPerPage,
      ordering: sortKey,
    };
    query = Object.assign(query, filters);
    const queryString = buildQuery(query);
    const fullUrl = `${props.recordsUrl}?${queryString}`;
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        setCurrentRecords(data.results);
        setTotalRecords(data.count);
        setLoading(false);
      });
  }, [props.recordsUrl, currentPage, sortKey, filters]);

  useEffect(() => {
    const totalPages = Math.ceil(
      totalRecords / recordsPerPage
    );
    if (totalPages === 0) {
      setCurrentPage(1);
    } else {
      setCurrentPage(
        currentPage => currentPage > totalPages ? totalPages : currentPage
      );
    }
  }, [totalRecords]);

  function handleSortChange(sortKey) {
    setSortKey(sortKey);
  }

  function handlePageChange(page) {
    if (page < 1) {
      page = 1;
    }
    setCurrentPage(page);
  }

  function handleFiltersChange(filters) {
    setFilters(filters);
  }

  return (
    <>
      <FilterSet
          filters={props.filters}
          onFiltersChange={handleFiltersChange}
        />
      <Card body>
        Showing {currentRecords.length} of
        {" "}{totalRecords} records.
      </Card>
      <Table
        striped
        hover
        className={loading && "loading"}
      >
        <thead>
          <tr>
            {props.schema.map(
              (item) => (
                <TableHeaderItem
                  key={item.sortKey}
                  name={item.name}
                  sortKey={item.sortKey}
                  sortedAsc={sortKey === item.sortKey}
                  sortedDesc={sortKey === "-" + item.sortKey}
                  onClick={handleSortChange}
                />
              ))}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(
            (record) => (
              <tr key={record.id}>
                {props.schema.map(
                  (item) => (
                    <TableItem
                      key={item.key}
                      schemaKey={item.key}
                      value={record[item.key]}
                      render={item.render}
                    />
                  ))}
              </tr>
            ))}
        </tbody>
      </Table>
      <nav aria-label="Table pagination">
        <Pagination
          onChange={handlePageChange}
          activePage={currentPage}
          itemsCountPerPage={recordsPerPage}
          totalItemsCount={totalRecords}
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
