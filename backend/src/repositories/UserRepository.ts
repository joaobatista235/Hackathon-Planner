import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

class UserRepository {
    async getAll() {
        return prisma.user.findMany({
            orderBy: { createdAt: 'asc' },
              select: {   // para não retornar a senha
                id: true,
                name: true,
                email: true,
                createdAt: true
                
            }

        });
    }

    async getById(id: string) {
        return prisma.user.findUnique({
            where: { id },
             select: {   // para não retornar a senha
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
    }

    async getByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
             select: {   // para não retornar a senha
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
    }
    async getByEmailWithPassword(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }


}
export default new UserRepository();