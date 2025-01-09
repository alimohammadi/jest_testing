import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProvider";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toBeInTheDocument();

    expect(priceInput).toBeInTheDocument();

    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);

    expect(priceInput).toHaveValue(product.price.toString());

    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on then name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  it("should display an error if name is missing", async () => {
    const { waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();

    // Act part
    const user = userEvent.setup();

    await user.type(form.priceInput, "10");
    await user.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(form.submitButton);

    const error = screen.getByRole("alert");

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});
