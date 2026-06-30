import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class BimesterPlanRepository {
  async getAll(authorId: string) {
    return prisma.bimesterPlan.findMany({
      where: { authorId },
      include: { class: { select: { id: true, name: true, subject: true } } },
      orderBy: { startsAt: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.bimesterPlan.findUnique({
      where: { id },
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async getByClassId(classId: string) {
    return prisma.bimesterPlan.findMany({
      where: { classId },
      include: { class: { select: { id: true, name: true, subject: true } } },
      orderBy: { startsAt: "asc" },
    });
  }

  async create(data: Prisma.BimesterPlanCreateInput) {
    return prisma.bimesterPlan.create({
      data,
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async update(id: string, data: Prisma.BimesterPlanUpdateInput) {
    return prisma.bimesterPlan.update({
      where: { id },
      data,
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async complete(id: string) {
    return prisma.bimesterPlan.update({
      where: { id },
      data: { status: "DONE" },
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async delete(id: string) {
    return prisma.bimesterPlan.delete({ where: { id } });
  }
}

export default new BimesterPlanRepository();
