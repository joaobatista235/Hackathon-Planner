import aiHistoryRepository from "@/repositories/AiHistoryRepository";

class AiHistoryService {

  async getAll() {
    return aiHistoryRepository.getAll();
  }

  async getById(id: number) {
    return aiHistoryRepository.getById(id);
  }

  async create(data: {
    userId: string;
    role: string;
    content: string;
  }) {
    return aiHistoryRepository.create({
      user: {
        connect: {
          id: data.userId,
        },
      },
      role: data.role,
      content: data.content,
    });
  }

  async getByUserId(userId: string) {
    return aiHistoryRepository.getByUserId(userId);
  }

  async getHistory(userId: string) {
    return aiHistoryRepository.getHistory(userId);
  }

  async delete(id: number) {
    return aiHistoryRepository.delete(id);
  }

  async deleteByUserId(userId: string) {
    return aiHistoryRepository.deleteByUserId(userId);
  }

}

export default new AiHistoryService();