import { Select, Table } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import QuantitySelector from "../components/QuantitySelector";
import { Category, Product } from "../entities";
import { useQuery } from "react-query";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  const productsQuery = useQuery<Product[], Error>({
    queryFn: async () =>
      axios.get<Product[]>("/products").then((res) => res.data),

    queryKey: ["products"],
  });

  const categoriesQuery = useQuery<Category[], Error>({
    queryFn: async () =>
      axios.get<Category[]>("/categories").then((res) => res.data),

    queryKey: ["categories"],
  });

  if (categoriesQuery.error)
    return <div>Error: {categoriesQuery.error.message}</div>;

  const renderCategories = () => {
    if (categoriesQuery.isLoading)
      return (
        <div role="progressbar" aria-label="Loading categories">
          <Skeleton />
        </div>
      );
    if (categoriesQuery.error) return null;
    return (
      <Select.Root
        onValueChange={(categoryId) =>
          setSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categoriesQuery.data?.map((category) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    if (productsQuery.error)
      return <div>Error: {productsQuery.error.message}</div>;

    const visibleProducts = selectedCategoryId
      ? productsQuery?.data?.filter((p) => p.categoryId === selectedCategoryId)
      : productsQuery.data || [];

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={productsQuery.isLoading ? "progressbar" : undefined}
          aria-label={productsQuery.isLoading ? "Loading products" : undefined}
        >
          {productsQuery.isLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!productsQuery.isLoading &&
            visibleProducts?.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">{renderCategories()}</div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
