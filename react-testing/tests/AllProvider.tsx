import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../src/providers/CartProvider";

const AllProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <Theme>
      <CartProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </CartProvider>
    </Theme>
  );
};

export default AllProviders;
