import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() =>
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productId = product.id;
    })
  );

  afterAll(() => db.product.delete({ where: { id: { equals: productId } } }));

  it("should render product details", async () => {
    render(<ProductDetail productId={productId} />);

    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    expect(
      await screen.findByText(
        new RegExp(
          db.product
            .findMany({ where: { id: { equals: productId } } })
            .toString()
        )
      )
    ).toBeInTheDocument();

    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();

    expect(
      await screen.findByText(new RegExp(product!.name.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    // The given product was not found.
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error for invalid product id", async () => {
    render(<ProductDetail productId={0} />);

    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });

  it("should render an error if data fetching fails", async () => {
    server.use(http.get("/products/:id", () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
