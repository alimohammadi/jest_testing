import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../src/providers/CartProvider";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      categoryId: 1,
      price: 5,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    const getAddToCartButton = () =>
      screen.queryByRole("button", { name: /add to cart/i });

    const getQuantityControls = () => ({
      quantity: screen.queryByRole("status"),
      decrementButton: screen.queryByRole("button", { name: "-" }),
      incrementButton: screen.queryByRole("button", { name: "+" }),
    });

    const user = userEvent.setup();

    const addToCart = async () => {
      const button = getAddToCartButton();
      await user.click(button!);
    };

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };

    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };

    return {
      getAddToCartButton,
      getQuantityControls,
      incrementQuantity,
      decrementQuantity,
      addToCart,
    };
  };

  it("should render the Add to Card Button", () => {
    const { getAddToCartButton } = renderComponent();

    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add product to the cart", async () => {
    const { getAddToCartButton, addToCart, getQuantityControls } =
      renderComponent();

    await addToCart();

    const { decrementButton, incrementButton, quantity } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");

    expect(decrementButton).toBeInTheDocument();

    expect(incrementButton).toBeInTheDocument();

    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { incrementQuantity, addToCart, getQuantityControls } =
      renderComponent();
    await addToCart();

    const { quantity } = getQuantityControls();

    await incrementQuantity();

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const {
      incrementQuantity,
      decrementQuantity,
      addToCart,
      getQuantityControls,
    } = renderComponent();
    await addToCart();

    const { quantity } = getQuantityControls();
    await incrementQuantity();

    await decrementQuantity();

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const {
      getAddToCartButton,
      decrementQuantity,
      addToCart,
      getQuantityControls,
    } = renderComponent();
    
    await addToCart();

    const { decrementButton, quantity, incrementButton } =
      getQuantityControls();

    await decrementQuantity();

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    screen.debug();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
