import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { IdToken, useAuth0, User } from "@auth0/auth0-react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render } from "@testing-library/react";
import routes from "../src/routes";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuth = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: function (): Promise<IdToken | undefined> {
      throw new Error("Function not implemented.");
    },
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};

export const navigateTo = (path: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [path],
  });

  render(<RouterProvider router={router} />);
};
