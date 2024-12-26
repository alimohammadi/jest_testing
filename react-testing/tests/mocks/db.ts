/* eslint-disable @typescript-eslint/unbound-method */
import { factory, manyOf, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
  },
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf("product"),
  },
});
