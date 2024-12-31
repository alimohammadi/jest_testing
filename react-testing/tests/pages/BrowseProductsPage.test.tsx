import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import userEvent from "@testing-library/user-event";
import { db, getProductsByCategory } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { simulateDelay, simulateError } from "../utils";
import AllProviders from "../AllProvider";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();

      categories.push(category);

      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    const productIds = products.map((product) => product.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const getCategoriesSkeleton = () =>
      screen.queryByRole("progressbar", { name: /categories/i });

    const getCategoriesCombobox = () => screen.queryByRole("combobox");

    const user = userEvent.setup();

    const selectCategory = async (name: string) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton());
      const combobox = getCategoriesCombobox();
      await user.click(combobox!);

      // Act part
      const option = screen.getByRole("option", {
        name,
      });
      await user.click(option);
    };

    const getProductsSkeleton = () =>
      screen.queryByRole("progressbar", { name: /products/i });

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      const rows = screen.getAllByRole("row");

      expect(rows).toHaveLength(products.length + 1);

      products.forEach((product) =>
        expect(screen.getByText(product.name)).toBeInTheDocument()
      );
    };

    return {
      getProductsSkeleton,
      getCategoriesSkeleton,
      getCategoriesCombobox,
      user,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton());
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories not fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton());

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(getCategoriesCombobox()).toBeInTheDocument();

    await user.click(getCategoriesCombobox()!);

    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) =>
      expect(screen.getByText(product.name)).toBeInTheDocument()
    );
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];

    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });
});
