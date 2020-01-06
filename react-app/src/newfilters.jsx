import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function SearchBox(props) {
  const input = useRef(null);
  useEffect(() => {
    const timeoutID = setTimeout(() => input.current.focus(), 100);
    return () => clearTimeout(timeoutID);
  }, []);
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
          ref={input}
          name={props.name}
          value={props.value || ""}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          aria-label={props.label}
          aria-describedby="basic-addon2"
        />
        <Button variant="danger" onClick={props.onRemove}>Remove</Button>
      </InputGroup>
    </Form.Group>
  );
}

function ChoiceBox(props) {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
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
            (choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
            ))}
        </FormControl>
        <Button variant="danger" onClick={props.onRemove}>Remove</Button>
      </InputGroup>
    </Form.Group>
  );
}

export default function FilterSet(props) {
  const filters = Object.fromEntries(props.availableFilters.map(
    (filter) => [filter.key, filter]
  ));

  function updateFilters(filterKey, value) {
    const newFilters = Object.assign({}, props.activeFilters);
    newFilters[filterKey] = value;
    props.onFiltersChange(newFilters);
  }

  return (
    <Card body>
      <Card.Title>Filters</Card.Title>
      <Form>
        {props.activeFilters && Object.keys(props.activeFilters).map(
          (filterKey) => {
            let filter = filters[filterKey];
            switch (filter.type) {
            case "search":
              return (
                <SearchBox
                  key={filter.key}
                  name={filter.key}
                  label={filter.name}
                  value={props.activeFilters[filter.key]}
                  placeholder={`Filter on ${filter.name}`}
                  onChange={value => updateFilters(filterKey, value)}
                  onRemove={() => props.onRemoveFilter(filterKey)}
                />
              );
            case "choice":
              return (
                <ChoiceBox
                  key={filter.key}
                  name={filter.key}
                  label={filter.name}
                  choicesUrl={filter.choicesUrl}
                  value={props.activeFilters[filter.key]}
                  onChange={value => updateFilters(filterKey, value)}
                  onRemove={() => props.onRemoveFilter(filterKey)}
                />
              );
            default:
              return null;
            }
          }
        )}
      </Form>
      <Dropdown onSelect={key => props.onAddFilter(key)}>
        <Dropdown.Toggle variant="primary" id="addFilterDropdown">
          Add filter
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {props.availableFilters.map(
            filter => {
              if (props.activeFilters && filter.key in props.activeFilters) {
                return null;
              } else {
                return (
                  <Dropdown.Item
                    key={filter.key}
                    eventKey={filter.key}
                  >
                    {filter.name}
                  </Dropdown.Item>
                );
              }
            })}
        </Dropdown.Menu>
      </Dropdown>
    </Card>
  );
}
