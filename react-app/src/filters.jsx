import React, { useState, useEffect, useRef } from "react";

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
          value={props.value}
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

export default class FilterSet extends React.Component {
  constructor(props) {
    super(props);

    // this stores the original order of the filters
    this.filterKeys = props.filters.map(filter => filter.key);

    const allFilters = props.filters.map(
      filter => [filter.key, Object.assign({active: false}, filter)]
    );

    this.state = {
      filters: Object.fromEntries(allFilters),
      activeFilters: [],
      currentFilters: {},
    };
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  handleFiltersChange(key, value) {
    const filters = Object.assign({}, this.state.currentFilters);

    filters[key] = value;

    this.setState({
      currentFilters: filters,
    });
    this.props.onFiltersChange(filters);
  }

  handleAddFilter(key) {
    const newFilters = Object.assign({}, this.state.filters);
    const newActiveFilters = this.state.activeFilters.slice();
    const newCurrentFilters = Object.assign({}, this.state.currentFilters);
    newFilters[key].active = true;
    newActiveFilters.push(key);
    newCurrentFilters[key] = "";
    this.setState({
      filters: newFilters,
      activeFilters: newActiveFilters,
      currentFilters: newCurrentFilters,
    });
  }

  handleRemoveFilter(index) {
    const newFilters = Object.assign({}, this.state.filters);
    const newActiveFilters = this.state.activeFilters.slice();
    const newCurrentFilters = Object.assign({}, this.state.currentFilters);
    const key = this.state.activeFilters[index];
    newFilters[key].active = false;
    newActiveFilters.splice(index, 1);
    delete newCurrentFilters[key];
    this.setState({
      filters: newFilters,
      activeFilters: newActiveFilters,
      currentFilters: newCurrentFilters,
    });
    this.props.onFiltersChange(newCurrentFilters);
  }

  render() {
    return (
      <Card body>
        <Card.Title>Filters</Card.Title>
        <Form>
          {this.state.activeFilters.map(
            (key, index) => {
              let filter = this.state.filters[key];
              switch (filter.type) {
              case "search":
                return (
                  <SearchBox
                    key={filter.key}
                    name={filter.key}
                    label={filter.name}
                    value={this.state.currentFilters[filter.key]}
                    placeholder={`Filter on ${filter.name}`}
                    onChange={
                      (value) => this.handleFiltersChange(filter.key, value)
                    }
                    onRemove={() => this.handleRemoveFilter(index)}
                  />
                );
              case "choice":
                return (
                  <ChoiceBox
                    key={filter.key}
                    name={filter.key}
                    label={filter.name}
                    choicesUrl={filter.choicesUrl}
                    value={this.state.currentFilters[filter.key]}
                    onChange={
                      (value) => this.handleFiltersChange(filter.key, value)
                    }
                    onRemove={() => this.handleRemoveFilter(index)}
                  />
                );
              default:
                return null;
              }
            }
          )}
        </Form>
        {this.filterKeys.length > this.state.activeFilters.length &&
         <Dropdown onSelect={key => this.handleAddFilter(key)}>
           <Dropdown.Toggle variant="primary" id="addFilterDropdown">
             Add filter
           </Dropdown.Toggle>
           <Dropdown.Menu>
             {this.filterKeys.map(
               key => this.state.filters[key]
             ).filter(
               filter => !filter.active
             ).map(
               filter => (
                   <Dropdown.Item
                     key={filter.key}
                     eventKey={filter.key}
                   >
                     {filter.name}
                   </Dropdown.Item>
               ))}
           </Dropdown.Menu>
         </Dropdown>}
      </Card>
    );
  }
}
