import type { AssessmentStatus, AssessmentType } from "@prisma/client";

import { AppError } from "@/middlewares/errorHandler";
import assessmentRepository from "@/repositories/AssessmentRepository";

class AssessmentService {
  async getAll(authorId: string) {
    return assessmentRepository.getAll(authorId);
  }

  async getById(id: string) {
    const assessment = await assessmentRepository.getById(id);
    if (!assessment) throw new AppError("Avaliação não encontrada", 404);
    return assessment;
  }

  async getByClassId(classId: string) {
    return assessmentRepository.getByClassId(classId);
  }

  async create(data: {
    title: string;
    description?: string;
    type: AssessmentType;
    dueDate: Date;
    classId: string;
    authorId: string;
  }) {
    return assessmentRepository.create({
      title: data.title,
      description: data.description,
      type: data.type,
      dueDate: data.dueDate,
      class: { connect: { id: data.classId } },
      author: { connect: { id: data.authorId } },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      type?: AssessmentType;
      dueDate?: Date;
      status?: AssessmentStatus;
    },
  ) {
    await this.getById(id);
    return assessmentRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id);
    return assessmentRepository.delete(id);
  }
}

export default new AssessmentService();
