import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  };
  it("should render with correct text and initial state", () => {
    const { button, checkbox, heading } = renderComponent();

    expect(heading).toHaveTextContent("Terms & Conditions");
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should enable the checkbox when the check box is checked", async () => {
    const user = userEvent.setup();
    const { checkbox, button } = renderComponent();

    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
