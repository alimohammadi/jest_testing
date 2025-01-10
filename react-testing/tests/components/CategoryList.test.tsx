import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Category } from "../../src/entities";
import { db } from "../mocks/db";
import CategoryList from "../../src/components/CategoryList";
import { simulateDelay, simulateError } from "../utils";
import AllProviders from "../AllProvider";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);

    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders });
  };

  it("should render a list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should render loading when fetching categories", () => {
    simulateDelay("/categories");

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render error message if fetching categories fails", async () => {
    simulateError("/categories");
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
