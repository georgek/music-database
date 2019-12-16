import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function SearchBox(props) {
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
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
            (choice) =>
              <option key={choice.id} value={choice.id}>
                {choice.name}
              </option>
          )}
        </FormControl>
        <Button variant="danger" onClick={props.onRemove}>Remove</Button>
      </InputGroup>
    </Form.Group>
  );
}

export default class FilterSet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableFilters: props.filters.slice(),
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

  handleAddFilter(index) {
    const newActiveFilters = Array.from(this.state.activeFilters);
    const newAvailableFilters = Array.from(this.state.availableFilters);
    const newCurrentFilters = Object.assign({}, this.state.currentFilters);
    newActiveFilters.push(this.state.availableFilters[index]);
    newAvailableFilters.splice(index, 1);
    newCurrentFilters[this.state.availableFilters[index].key] = "";
    this.setState({
      availableFilters: newAvailableFilters,
      activeFilters: newActiveFilters,
      currentFilters: newCurrentFilters,
    });
    this.props.onFiltersChange(newCurrentFilters);
  }

  handleRemoveFilter(index) {
    const newActiveFilters = Array.from(this.state.activeFilters);
    const newAvailableFilters = Array.from(this.state.availableFilters);
    const newCurrentFilters = Object.assign({}, this.state.currentFilters);
    newAvailableFilters.push(this.state.activeFilters[index]);
    newActiveFilters.splice(index, 1);
    delete newCurrentFilters[this.state.activeFilters[index].key];
    this.setState({
      availableFilters: newAvailableFilters,
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
            (filter, index) => {
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
        {this.state.availableFilters.length > 0 &&
         <Dropdown>
           <Dropdown.Toggle variant="primary" id="addFilterDropdown">
             Add filter
           </Dropdown.Toggle>
           <Dropdown.Menu>
             {this.state.availableFilters.map(
               (filter, index) =>
                 <Dropdown.Item
                   key={filter.key}
                   onClick={() => this.handleAddFilter(index)}
                 >
                   {filter.name}
                 </Dropdown.Item>
             )}
           </Dropdown.Menu>
         </Dropdown>}
      </Card>
    );
  }
}
