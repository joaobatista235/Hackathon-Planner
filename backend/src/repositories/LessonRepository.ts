import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class LessonRepository {
  async getAll() {
    return prisma.lesson.findMany({
      orderBy: { id: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.LessonCreateInput) {
    return prisma.lesson.create({
      data,
    });
  }

  async update(id: string, data: Prisma.LessonUpdateInput) {
    return prisma.lesson.update({
      where: { id },
      data,
    });
  }
  async delete(id: string) {
    return prisma.lesson.delete({
      where: { id },
    });
  }
  async getByLessonId(classId: string) {
    return prisma.lesson.findMany({
      where: { classId },
      orderBy: { id: "asc" },
    });
  }
}
export default new LessonRepository();
