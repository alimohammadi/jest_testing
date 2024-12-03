import { render, screen, fireEvent } from "@testing-library/react";

import SummaryForm from "../SummaryForm";

test("Initial condition", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", { name: "Confirm order" });

  expect(confirmButton).toBeDisabled();
});

test("Checkbox enables button on first click and disable on second click", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  const confirmButton = screen.getByRole("button", { name: "Confirm order" });

  fireEvent.click(checkbox);
  expect(checkbox).toBeEnabled();

  fireEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});
