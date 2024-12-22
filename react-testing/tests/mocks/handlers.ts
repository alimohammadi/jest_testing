import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 1, name: "Beauty" },
      { id: 1, name: "Gardening" },
    ]);
  }),
];
