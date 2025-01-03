const { render, screen, fireEvent } = require("@testing-library/react");
import App from "./App";
import { kebabCaseToTitleCase } from "./helpers";

test("button has correct initial color, and update when clicked", () => {
  render(<App />); // (1)

  // find an element with a role of button and text of 'Change to blue'
  const buttonElement = screen.getByRole("button", { name: "Change to blue" }); // (2)

  // expect the background color to be red
  expect(buttonElement).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });

  // click button
  fireEvent.click(buttonElement);

  // expect to have background color to be blue
  expect(buttonElement).toHaveStyle({ backgroundColor: "rgb(0,0,255)" });

  // expect the button text to be "Change to red"
  expect(buttonElement).toHaveTextContent("Change to red");
});

test("Initial Conditions", () => {
  render(<App />);

  // Check that the button starts out enabled
  const buttonElement = screen.getByRole("button", { name: "Change to blue" });
  expect(buttonElement).toBeEnabled();

  // Check that the checkbox starts out unchecked
  const checkBox = screen.getByRole("checkbox");
  expect(checkBox).not.toBeChecked();
});

test("Checkbox disables button on fist click and enable on secod click", () => {
  render(<App />);

  const buttonElement = screen.getByRole("button");
  const checkBox = screen.getByRole("checkbox");

  fireEvent.click(checkBox);
  // Check that the button disabled after checkbox checked
  expect(buttonElement).not.toBeEnabled();

  fireEvent.click(checkBox);

  expect(buttonElement).toBeEnabled();
});

test("Button color change when check box disable", () => {
  render(<App />);

  const buttonElement = screen.getByRole("button");
  const checkBox = screen.getByRole("checkbox");

  fireEvent.click(checkBox);
  // Check that the button disabled after checkbox checked
  expect(buttonElement).toHaveStyle({ backgroundColor: "rgb(128,128,128)" });

  fireEvent.click(checkBox);

  expect(buttonElement).toBeEnabled();
});

describe("kebabCaseToTitleCase", () => {
  test("Works for no hypens", () => {
    expect(kebabCaseToTitleCase("red")).toBe("Red");
  });
  test("Works for one hyphen", () => {
    expect(kebabCaseToTitleCase("midnight-blue")).toBe("Midnight Blue");
  });
  test("Works for multiple inner hyphens", () => {
    expect(kebabCaseToTitleCase("medium-violet-red")).toBe("Medium Violet Red");
  });
});
