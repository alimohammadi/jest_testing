const { render, screen, fireEvent } = require("@testing-library/react");
import App from "./App";

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

test("button turns blue when clicked", () => {
  render(<App />);

  const colorButton = screen.getByRole("button", { name: "Change to blue" });
});
