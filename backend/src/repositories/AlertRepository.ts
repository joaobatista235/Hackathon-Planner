import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class AlertRepository {
  async getAll(authorId: string) {
    return prisma.alert.findMany({
      where: { authorId },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    });
  }

  async getPending(authorId: string) {
    return prisma.alert.findMany({
      where: { authorId, status: "PENDING" },
      orderBy: { dueDate: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.alert.findUnique({ where: { id } });
  }

  async create(data: Prisma.AlertCreateInput) {
    return prisma.alert.create({ data });
  }

  async update(id: string, data: Prisma.AlertUpdateInput) {
    return prisma.alert.update({ where: { id }, data });
  }

  async complete(id: string) {
    return prisma.alert.update({
      where: { id },
      data: { status: "DONE" },
    });
  }

  async delete(id: string) {
    return prisma.alert.delete({ where: { id } });
  }
}

export default new AlertRepository();
