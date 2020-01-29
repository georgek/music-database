import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import { ChoiceBox, SearchBox } from "../filters";

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("SearchBox", () => {
  it("renders correctly", () => {
    render(
      <SearchBox
        name="name"
        label="label"
        value="value"
        placeholder="placeholder"
        onChange={() => null}
        onRemove={() => null}
      />,
      container
    );
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });
});

describe("ChoiceBox", () => {
  it("fetches choices from choicesUrl", async () => {
    const fakeChoicesData = {
      results: [
        {
          id: 1,
          name: "Choice 1",
        },
        {
          id: 2,
          name: "Choice 2",
        },
      ],
    };
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeChoicesData),
      })
    );
    await act(async () => {
      render(
        <ChoiceBox
          name="name"
          label="label"
          value={1}
          placeholder="placeholder"
          choicesUrl="test-url"
          onChange={() => null}
          onRemove={() => null}
        />,
        container
      );
    });

    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("test-url");

    global.fetch.mockClear();
    delete global.fetch;
  });
});
