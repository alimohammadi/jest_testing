import { render, screen } from "@testing-library/react";
import { mockAuth } from "../utils";
import AuthStatus from "../../src/components/AuthStatus";

describe("AuthStatus", () => {
  it("should render the loading message while loading the authentication message", () => {
    mockAuth({ isAuthenticated: false, isLoading: true, user: undefined });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render the login button if the user is not authenticated", () => {
    mockAuth({ isAuthenticated: false, isLoading: false, user: undefined });

    render(<AuthStatus />);

    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(
        screen.queryByRole("button", { name: /log out/i })
      ).not.toBeInTheDocument();
  });

  it("should render the user name if authenticated", () => {
    mockAuth({
      isAuthenticated: true,
      isLoading: false,
      user: { name: "Ali Mohammadi" },
    });

    render(<AuthStatus />);

    expect(screen.getByText(/ali mohammadi/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
