import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

test("Checkbox enables button on first click and disable on second click", async () => {
  const user = await userEvent.setup();

  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  const confirmButton = screen.getByRole("button", { name: "Confirm order" });

  await user.click(checkbox);
  expect(checkbox).toBeEnabled();

  await user.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover response to hover", async () => {
  const user = await userEvent.setup();

  render(<SummaryForm />);

  // Popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );

  expect(nullPopover).not.toBeInTheDocument();

  // Popover apears on mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);

  await user.hover(termsAndConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disapears when we mouse out
  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();

});
