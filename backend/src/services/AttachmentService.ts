import prisma from "@/database/prisma";
import fs from "fs/promises";
import path from "path";
import { AppError } from "@/middlewares/errorHandler";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

class AttachmentService {
  async getByLesson(lessonId: string) {
    return prisma.attachment.findMany({
      where: { lessonId },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    lessonId: string;
  }) {
    const url = `/uploads/${data.filename}`;
    return prisma.attachment.create({
      data: { ...data, url },
    });
  }

  async delete(id: string) {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new AppError("Anexo não encontrado", 404);

    const filePath = path.join(UPLOAD_DIR, attachment.filename);
    await fs.unlink(filePath).catch(() => {});

    return prisma.attachment.delete({ where: { id } });
  }
}

export default new AttachmentService();
