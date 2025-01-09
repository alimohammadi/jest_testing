/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button");

        type FormData = { [key in keyof Product]: any };

        const validData: FormData = {
          id: 1,
          name: "a",
          price: 1,
          categoryId: 1,
        };

        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name !== undefined)
            await user.type(nameInput, product.name);

          if (product.price !== undefined)
            await user.type(priceInput, product.price.toString());

          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          expectErrorToBeInDocument: (errorMessage: RegExp) => {
            const error = screen.getByRole("alert");

            expect(error).toBeInTheDocument();
            expect(error).toHaveTextContent(errorMessage);
          },
          nameInput,
          priceInput,
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
          fill,
          validData,
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

  it.each([
    { senario: "missing", errorMessage: /required/i },
    {
      senario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $senario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, name });

      form.expectErrorToBeInDocument(errorMessage);
    }
  );

  it.each([
    { senario: "missing", errorMessage: /required/i },
    {
      senario: "0",
      price: 0,
      errorMessage: /1/i,
    },
    {
      senario: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      senario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      senario: "nut a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if price is $senario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, price });

      form.expectErrorToBeInDocument(errorMessage);
    }
  );
});
