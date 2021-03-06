import React, { useEffect, useState } from "react";

import Pagination from "react-js-pagination";

import {
  useQueryParam,
  NumberParam,
  ObjectParam,
  StringParam,
} from "use-query-params";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import FilterSet from "./filters.jsx";

function buildQuery(object) {
  const items = Object.keys(object)
    .filter(key => object[key])
    .map(key => `${key}=${encodeURIComponent(object[key])}`);
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
          className="btn btn-link thead"
          href="#"
          onClick={e => {
            e.preventDefault();
            props.onClick(newSortKey);
          }}
        >
          {label}
        </button>
      ) : (
        label
      )}
    </th>
  );
}

function TableItem(props) {
  const value = props.render ? props.render(props.value) : props.value;
  if (props.schemaKey === "id") {
    return <th scope="row">{value}</th>;
  }
  return <td>{value}</td>;
}

export default function DataTable(props) {
  const recordsPerPage = 20;

  const [currentUrl, setCurrentUrl] = useState("");
  const [currentRecords, setCurrentRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useQueryParam("page", NumberParam);
  const [sortKey, setSortKey] = useQueryParam("sort", StringParam);
  const [filters, setFilters] = useQueryParam("filter", ObjectParam);

  useEffect(() => {
    let query = {
      limit: recordsPerPage,
      offset: (currentPage - 1) * recordsPerPage,
      ordering: sortKey,
    };
    query = Object.assign(query, filters);
    const queryString = buildQuery(query);
    const fullUrl = `${props.recordsUrl}?${queryString}`;
    setCurrentUrl(fullUrl);
  }, [props.recordsUrl, currentPage, sortKey, filters]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch(currentUrl);
      if (response.status === 200) {
        const data = await response.json();
        setCurrentRecords(data.results);
        setTotalRecords(data.count);
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUrl]);

  useEffect(() => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    if (totalPages === 0) {
      setCurrentPage(1, "PushIn");
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages, "replaceIn");
    }
  }, [currentPage, setCurrentPage, totalRecords]);

  function handleSortChange(sortKey) {
    setSortKey(sortKey, "pushIn");
  }

  function handlePageChange(page) {
    if (page < 1) {
      page = 1;
    }
    setCurrentPage(page, "pushIn");
  }

  function handleFiltersChange(filters) {
    setFilters(filters, "replaceIn");
  }

  function handleAddFilter(filterKey) {
    const newFilters = Object.assign({}, filters);
    newFilters[filterKey] = "";
    setFilters(newFilters, "pushIn");
  }

  function handleRemoveFilter(filterKey) {
    const newFilters = Object.assign({}, filters);
    delete newFilters[filterKey];
    setFilters(newFilters, "pushIn");
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
        Showing {currentRecords.length} of {totalRecords} records.
      </Card>
      <Table striped hover size="sm" className={loading && "loading"}>
        <thead>
          <tr>
            {props.schema.map(item => (
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
          {currentRecords.map(record => (
            <tr key={record.id}>
              {props.schema.map(item => (
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
