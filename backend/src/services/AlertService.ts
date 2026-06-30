import type { AlertPriority } from "@prisma/client";

import { AppError } from "@/middlewares/errorHandler";
import alertRepository from "@/repositories/AlertRepository";

class AlertService {
  async getAll(authorId: string) {
    return alertRepository.getAll(authorId);
  }

  async getPending(authorId: string) {
    return alertRepository.getPending(authorId);
  }

  async create(data: {
    title: string;
    message: string;
    priority: AlertPriority;
    dueDate?: Date;
    authorId: string;
  }) {
    return alertRepository.create({
      title: data.title,
      message: data.message,
      priority: data.priority,
      dueDate: data.dueDate,
      author: { connect: { id: data.authorId } },
    });
  }

  async update(
    id: string,
    data: { title?: string; message?: string; priority?: AlertPriority; dueDate?: Date },
  ) {
    const alert = await alertRepository.getById(id);
    if (!alert) throw new AppError("Alerta não encontrado", 404);
    return alertRepository.update(id, data);
  }

  async complete(id: string) {
    const alert = await alertRepository.getById(id);
    if (!alert) throw new AppError("Alerta não encontrado", 404);
    return alertRepository.complete(id);
  }

  async delete(id: string) {
    const alert = await alertRepository.getById(id);
    if (!alert) throw new AppError("Alerta não encontrado", 404);
    return alertRepository.delete(id);
  }

  /**
   * Gera alertas automáticos para um evento com data de vencimento.
   * URGENT: <= 24h | NEAR: <= 7d | OVERDUE: vencido.
   * Não duplica se já existe alerta com mesmo título e authorId.
   */
  static computePriority(dueDate: Date): AlertPriority {
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) return "OVERDUE";
    if (diffHours <= 24) return "URGENT";
    return "NEAR";
  }
}

export default new AlertService();
