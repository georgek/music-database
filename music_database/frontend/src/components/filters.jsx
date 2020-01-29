import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export function SearchBox(props) {
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
          onChange={e => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          aria-label={props.label}
          aria-describedby="basic-addon2"
        />
        <Button variant="danger" onClick={props.onRemove}>
          Remove
        </Button>
      </InputGroup>
    </Form.Group>
  );
}

export function ChoiceBox(props) {
  const [choices, setChoices] = useState([]);

  async function fetchChoices(url) {
    const response = await fetch(url);
    const data = await response.json();
    setChoices(data.results);
  }

  useEffect(() => {
    fetchChoices(props.choicesUrl);
  }, [props.choicesUrl]);

  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
          as="select"
          name={props.name}
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
          aria-label={props.label}
          aria-describedby="basic-addon2"
        >
          <option value="">(All)</option>
          {choices.map(choice => (
            <option key={choice.id} value={choice.id}>
              {choice.name}
            </option>
          ))}
        </FormControl>
        <Button variant="danger" onClick={props.onRemove}>
          Remove
        </Button>
      </InputGroup>
    </Form.Group>
  );
}

export default function FilterSet(props) {
  const [activeFilters, setActiveFilters] = useState(props.activeFilters);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    setActiveFilters(props.activeFilters);
  }, [props.activeFilters]);

  const filters = Object.fromEntries(
    props.availableFilters.map(filter => [filter.key, filter])
  );

  function updateFilters(filterKey, value) {
    const newFilters = Object.assign({}, activeFilters);
    newFilters[filterKey] = value;
    setActiveFilters(newFilters);
    if (timerId) {
      clearTimeout(timerId);
    }
    setTimerId(
      setTimeout(() => {
        props.onFiltersChange(newFilters);
        setTimerId(null);
      }, 200)
    );
  }

  function addFilter(filterKey) {
    const newFilters = Object.assign({}, activeFilters);
    newFilters[filterKey] = "";
    setActiveFilters(newFilters);
    props.onAddFilter(filterKey);
  }

  function removeFilter(filterKey) {
    const newFilters = Object.assign({}, activeFilters);
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    props.onRemoveFilter(filterKey);
  }

  return (
    <Card body>
      <Card.Title>Filters</Card.Title>
      <Form>
        {activeFilters &&
          Object.keys(activeFilters).map(filterKey => {
            let filter = filters[filterKey];
            switch (filter.type) {
              case "search":
                return (
                  <SearchBox
                    key={filter.key}
                    name={filter.key}
                    label={filter.name}
                    value={activeFilters[filter.key]}
                    placeholder={`Filter on ${filter.name}`}
                    onChange={value => updateFilters(filterKey, value)}
                    onRemove={() => removeFilter(filterKey)}
                  />
                );
              case "choice":
                return (
                  <ChoiceBox
                    key={filter.key}
                    name={filter.key}
                    label={filter.name}
                    choicesUrl={filter.choicesUrl}
                    value={activeFilters[filter.key]}
                    onChange={value => updateFilters(filterKey, value)}
                    onRemove={() => removeFilter(filterKey)}
                  />
                );
              default:
                return null;
            }
          })}
      </Form>
      <Dropdown onSelect={key => addFilter(key)}>
        <Dropdown.Toggle variant="primary" id="addFilterDropdown">
          Add filter
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {props.availableFilters.map(filter => {
            if (activeFilters && filter.key in activeFilters) {
              return null;
            } else {
              return (
                <Dropdown.Item key={filter.key} eventKey={filter.key}>
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
