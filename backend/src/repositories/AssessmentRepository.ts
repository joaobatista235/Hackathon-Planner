import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class AssessmentRepository {
  async getAll(authorId: string) {
    return prisma.assessment.findMany({
      where: { authorId },
      include: { class: { select: { id: true, name: true, subject: true } } },
      orderBy: { dueDate: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.assessment.findUnique({
      where: { id },
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async getByClassId(classId: string) {
    return prisma.assessment.findMany({
      where: { classId },
      include: { class: { select: { id: true, name: true, subject: true } } },
      orderBy: { dueDate: "asc" },
    });
  }

  async create(data: Prisma.AssessmentCreateInput) {
    return prisma.assessment.create({
      data,
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async update(id: string, data: Prisma.AssessmentUpdateInput) {
    return prisma.assessment.update({
      where: { id },
      data,
      include: { class: { select: { id: true, name: true, subject: true } } },
    });
  }

  async delete(id: string) {
    return prisma.assessment.delete({ where: { id } });
  }
}

export default new AssessmentRepository();
