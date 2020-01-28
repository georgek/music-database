import React from "react";
import { SearchBox } from "../filters";
import renderer from "react-test-renderer";

describe("SearchBox", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <SearchBox
        name="name"
        label="label"
        value="value"
        placeholder="placeholder"
        onChange={() => null}
        onRemove={() => null}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
