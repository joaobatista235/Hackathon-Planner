process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/postsdb";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
