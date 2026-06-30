import type { Prisma } from "@prisma/client";

import prisma from "@/database/prisma";

class PostsRepository {
  async getAll() {
    return prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async getById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({
      data,
      include: {
        author: true,
      },
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput) {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }

  async search(term: string) {
    return prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { content: { contains: term, mode: "insensitive" } },
        ],
      },
      include: {
        author: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async getByAuthorId(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: "asc" },
      include: {
        author: true,
      },
    });
  }
}

export default new PostsRepository();
