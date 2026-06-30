import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

class UserRepository {
  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: userSelect,
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  async getByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: userSelect,
    });
  }
}

export default new UserRepository();
