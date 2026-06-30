import request from "supertest";

import app from "@/app";

jest.mock("@/repositories/PostsRepository", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(async () => [
      { id: 1, title: "Primeiro Post", content: "Conteúdo", author: null },
    ]),
    getById: jest.fn(async (id: number) => ({
      id,
      title: "Post " + id,
      content: "Conteúdo",
      author: null,
    })),
    create: jest.fn(async (data) => ({
      id: 1,
      ...data,
      author: null,
    })),
    update: jest.fn(async (id, data) => ({ id, ...data, author: null })),
    delete: jest.fn(async () => true),
    search: jest.fn(async () => []),
    getByAuthorId: jest.fn(async () => []),
  },
}));

jest.mock("@/middlewares/authenticate", () => ({
  authenticate: (req: { userId?: string }, _res: unknown, next: () => void) => {
    req.userId = "mock-user-id";
    next();
  },
}));

describe("Posts API", () => {
  it("deve criar um novo post (POST /api/posts)", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", "Bearer mock-token")
      .send({ title: "Novo Post", content: "Conteúdo" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Novo Post");
  });

  it("deve listar posts (GET /api/posts)", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
