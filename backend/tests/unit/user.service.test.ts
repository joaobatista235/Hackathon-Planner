import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "@/env";
import { AppError } from "@/middlewares/errorHandler";
import userRepository from "@/repositories/UserRepository";
import userService from "@/services/UserService";

jest.mock("@/repositories/UserRepository", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(async () => []),
    getById: jest.fn(async () => null),
    getByEmail: jest.fn(async () => null),
    getByEmailWithPassword: jest.fn(async () => null),
    create: jest.fn(async (data) => ({
      id: "user-1",
      name: data.name,
      email: data.email,
      role: "USER",
      createdAt: new Date(),
    })),
    update: jest.fn(async (id, data) => ({
      id,
      name: data.name ?? "User",
      email: data.email ?? "user@test.com",
      role: "USER",
      createdAt: new Date(),
    })),
    delete: jest.fn(async () => ({
      id: "user-1",
      name: "User",
      email: "user@test.com",
      role: "USER",
      createdAt: new Date(),
    })),
  },
}));

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar usuário sem retornar senha", async () => {
    const user = await userService.create({
      name: "João",
      email: "joao@test.com",
      password: "123456",
    });

    expect(user).not.toHaveProperty("password");
    expect(user.email).toBe("joao@test.com");
  });

  it("deve atualizar usuário", async () => {
    const updated = await userService.update("user-1", {
      name: "João Atualizado",
    });
    expect(updated.name).toBe("João Atualizado");
    expect(userRepository.update).toHaveBeenCalled();
  });

  it("deve fazer login e retornar token", async () => {
    const hash = await bcrypt.hash("123456", 10);
    (userRepository.getByEmailWithPassword as jest.Mock).mockResolvedValueOnce({
      id: "user-1",
      name: "João",
      email: "joao@test.com",
      password: hash,
      role: "USER",
    });

    const result = await userService.login("joao@test.com", "123456");

    expect(result.token).toBeDefined();
    const decoded = jwt.verify(result.token, env.JWT_SECRET) as { id: string };
    expect(decoded.id).toBe("user-1");
  });

  it("deve rejeitar credenciais inválidas", async () => {
    await expect(
      userService.login("joao@test.com", "wrong"),
    ).rejects.toBeInstanceOf(AppError);
  });
});
