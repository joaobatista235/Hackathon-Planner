import { Prisma, PrismaClient } from "@prisma/client";
import LessonRepository from "@/repositories/LessonRepository";
const prisma = new PrismaClient();

class LessonService {
    async getAll() {
        return LessonRepository.getAll();
    }

    async getById(id: string) {
        return LessonRepository.getById(id);
    }   

    async create(data: Prisma.LessonCreateInput) {
        return LessonRepository.create(data);
    }

    async update(id: string, data: Prisma.LessonUpdateInput) {
        return LessonRepository.update(id, data);
    }
    async delete(id: string) {
        return LessonRepository.delete(id);
    }
    async getByLessonId(classId: string) {
        return LessonRepository.getByLessonId(classId);
    }
}

export default new LessonService();