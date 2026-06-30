import type { PlanStatus } from "@prisma/client";

import { AppError } from "@/middlewares/errorHandler";
import bimesterPlanRepository from "@/repositories/BimesterPlanRepository";

class BimesterPlanService {
  async getAll(authorId: string) {
    return bimesterPlanRepository.getAll(authorId);
  }

  async getById(id: string) {
    const plan = await bimesterPlanRepository.getById(id);
    if (!plan) throw new AppError("Planejamento não encontrado", 404);
    return plan;
  }

  async getByClassId(classId: string) {
    return bimesterPlanRepository.getByClassId(classId);
  }

  async create(data: {
    title: string;
    goals: string;
    startsAt: Date;
    endsAt: Date;
    classId: string;
    authorId: string;
  }) {
    if (data.endsAt <= data.startsAt) {
      throw new AppError(
        "A data de término deve ser posterior à data de início",
        400,
      );
    }
    return bimesterPlanRepository.create({
      title: data.title,
      goals: data.goals,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      class: { connect: { id: data.classId } },
      author: { connect: { id: data.authorId } },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      goals?: string;
      startsAt?: Date;
      endsAt?: Date;
      status?: PlanStatus;
    },
  ) {
    await this.getById(id);
    return bimesterPlanRepository.update(id, data);
  }

  async complete(id: string) {
    await this.getById(id);
    return bimesterPlanRepository.complete(id);
  }

  async delete(id: string) {
    await this.getById(id);
    return bimesterPlanRepository.delete(id);
  }
}

export default new BimesterPlanService();
