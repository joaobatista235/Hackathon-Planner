import { Prisma, PrismaClient } from "@prisma/client";
import ClassRepository from "@/repositories/ClassRepository";

const prisma = new PrismaClient();
class ClassService {

  async getAll() {
    return ClassRepository.getAll();
  }

    async getById(id: string) {
        return ClassRepository.getById(id);
    }

    async create(data: Prisma.ClassCreateInput) {
        return ClassRepository.create(data);
    }

    async update(id: string, data: Prisma.ClassUpdateInput) {
        return ClassRepository.update(id, data);
    }
    async delete(id: string) {
        return ClassRepository.delete(id);
    }
    async getByTeacherId(authorId: string) {
        return ClassRepository.getByTeacherId(authorId);
    }
    
}
export default new ClassService();