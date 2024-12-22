import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderOrderStatus = () => {
    const onChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      button: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole("option"),
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      onChange,
    };
  };

  it("should render 'New' as default value", () => {
    const { button } = renderOrderStatus();

    expect(button).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { button, user, getOptions } = renderOrderStatus();

    expect(button).toHaveTextContent(/new/i);

    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);

    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onchange with $value when $label option is selected",
    async ({ label, value }) => {
      const { button, user, onChange } = renderOrderStatus();
      await user.click(button);

      // user.click
      const option = await screen.findByRole("option", { name: label });

      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onchange with 'new' when the new option is selected", async () => {
    const { button, user, getOption, onChange } = renderOrderStatus();

    await user.click(button);

    const processedOption = await getOption(/processed/i);

    await user.click(processedOption);

    await user.click(button);
    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
