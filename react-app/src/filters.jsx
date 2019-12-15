import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
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
        {props.value &&
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => props.onChange("")}
            >
              Clear
            </Button>
          </InputGroup.Append>}
      </InputGroup>
    </Form.Group>
  );
}

function ChoiceBox(props) {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    console.log(props.choicesUrl);
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
      </InputGroup>
    </Form.Group>
  );
}

export default class FilterSet extends React.Component {
  constructor(props) {
    super(props);

    this.filterKeys = props.filters.map(
      (field) => field.key
    );
    const filterEntries = this.filterKeys.map(
      (key) => [key, ""]
    );

    this.state = {
      filters: Object.fromEntries(filterEntries),
      searchString: "",
    };
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
  }

  handleFiltersChange(key, value) {
    const filters = Object.assign({}, this.state.filters);

    filters[key] = value;

    this.setState({
      filters: filters,
    });
    this.props.onFiltersChange(filters);
  }

  handleSearchStringChange(value) {
    this.setState({
      searchString: value,
    });
    this.props.onSearchStringChange(value);
  }

  render() {
    return (
      <Card body>
        <Card.Title>Filters</Card.Title>
        <Form>
          {this.props.filters.map(
            (field) => {
              switch (field.type) {
              case "search":
                return (
                  <SearchBox
                    key={field.key}
                    name={field.key}
                    label={field.name}
                    value={this.state.filters[field.key]}
                    placeholder={`Filter on ${field.name}`}
                    onChange={
                      (value) => this.handleFiltersChange(field.key, value)
                    }
                  />
                );
              case "choice":
                return (
                  <ChoiceBox
                    key={field.key}
                    name={field.key}
                    label={field.name}
                    choicesUrl={field.choicesUrl}
                    value={this.state.filters[field.key]}
                    onChange={
                      (value) => this.handleFiltersChange(field.key, value)
                    }
                  />
                );
              default:
                return null;
              }
            }
          )}
        </Form>
      </Card>
    );
  }
}
