import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class AiHistoryRepository {

  async getAll() {
    return prisma.aiMessage.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getById(id: number) {
    return prisma.aiMessage.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: Prisma.AiMessageCreateInput) {
    return prisma.aiMessage.create({
      data,
    });
  }

  async delete(id: number) {
    return prisma.aiMessage.delete({
      where: {
        id,
      },
    });
  }

  async getByUserId(userId: string) {
    return prisma.aiMessage.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getHistory(userId: string) {
    return prisma.aiMessage.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async deleteByUserId(userId: string) {
    return prisma.aiMessage.deleteMany({
      where: {
        userId,
      },
    });
  }

}

export default new AiHistoryRepository();