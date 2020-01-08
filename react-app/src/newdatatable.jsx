import React, { useEffect, useState } from "react";

import Pagination from "react-js-pagination";

import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { encodeObject } from 'serialize-query-params';

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import FilterSet from "./newfilters.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function buildQuery(object) {
  const items = Object.keys(object).filter(
    key => object[key]
  ).map(
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

function decodeObject(
  input,
  keyValSeparator = '-',
  entrySeparator = '_'
) {
  if (input == null) {
    return undefined;
  }

  const objStr = input instanceof Array ? input[0] : input;

  if (!objStr || !objStr.length) {
    return undefined;
  }

  const obj = {};

  const keyValSeparatorRegExp = new RegExp(`${keyValSeparator}(.*)`);
  objStr.split(entrySeparator).forEach(entryStr => {
    const [key, value] = entryStr.split(keyValSeparatorRegExp);
    obj[key] = value;
  });

  return obj;
}

const ObjectWithEmptyStringsParam = {
  encode: encodeObject,
  decode: decodeObject,
};

export default function DataTable(props) {
  const recordsPerPage = 10;

  const [currentRecords, setCurrentRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useQueryParam("page", NumberParam);
  const [sortKey, setSortKey] = useQueryParam("sort", StringParam);
  const [filters, setFilters] = useQueryParam(
    "filter", ObjectWithEmptyStringsParam
  );
  console.log(filters);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let query = {
        limit: recordsPerPage,
        offset:(currentPage - 1) * recordsPerPage,
        ordering: sortKey,
      };
      query = Object.assign(query, filters);
      const queryString = buildQuery(query);
      const fullUrl = `${props.recordsUrl}?${queryString}`;
      const response = await fetch(fullUrl);
      if (response.status === 200) {
        const data = await response.json();
        setCurrentRecords(data.results);
        setTotalRecords(data.count);
        setLoading(false);
      }
    }
    fetchData();
  }, [props.recordsUrl, currentPage, sortKey, filters]);

  useEffect(() => {
    const totalPages = Math.ceil(
      totalRecords / recordsPerPage
    );
    if (totalPages === 0) {
      setCurrentPage(1, "PushIn");
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages, "replaceIn");
    }
  }, [currentPage, setCurrentPage, totalRecords]);

  function handleSortChange(sortKey) {
    setSortKey(sortKey, "replaceIn");
  }

  function handlePageChange(page) {
    if (page < 1) {
      page = 1;
    }
    setCurrentPage(page, "pushIn");
  }

  function handleFiltersChange(filters) {
    setFilters(filters);
  }

  function handleAddFilter(filterKey) {
    const newFilters = Object.assign({}, filters);
    newFilters[filterKey] = "";
    setFilters(newFilters);
  }

  function handleRemoveFilter(filterKey) {
    const newFilters = Object.assign({}, filters);
    delete newFilters[filterKey];
    setFilters(newFilters);
  }

  return (
    <>
      <FilterSet
        availableFilters={props.availableFilters}
        activeFilters={filters}
        onFiltersChange={handleFiltersChange}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
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
