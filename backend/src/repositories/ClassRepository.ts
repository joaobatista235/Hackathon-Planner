import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class ClassRepository {
  async getAll() {
    return prisma.class.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.class.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ClassCreateInput) {
    return prisma.class.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ClassUpdateInput) {
    return prisma.class.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.class.delete({
      where: { id },
    });
  }

  async getByTeacherId(authorId: string) {
    return prisma.class.findMany({
      where: { authorId },
      orderBy: { id: "asc" },
    });
  }
}

export default new ClassRepository();
