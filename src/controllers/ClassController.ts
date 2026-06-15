import { Request, Response } from 'express';
import classService from '@/services/ClassService';
import { getUserFromToken } from '@/utils/getUserFromToken';

class ClassController {
    async getAll(_req: Request, res: Response) {
        const classes = await classService.getAll();
        return res.json(classes);
    }

    async getById(req: Request, res: Response) {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const classData = await classService.getById(id);
        return res.json(classData);
    }

    async create(req: Request, res: Response) {
        const authorId = getUserFromToken(req);

        const { name, subject } = req.body;

        const newClass = await classService.create({
            name,
            subject,
            author: {
                connect: {
                    id: authorId
                }
            }
        });

        return res.status(201).json(newClass);
    }

    async update(req: Request, res: Response) {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const { name, subject } = req.body;

        const updatedClass = await classService.update(id, {
            name,
            subject
        });

        return res.json(updatedClass);
    }

    async delete(req: Request, res: Response) {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        await classService.delete(id);

        return res.status(204).send();
    }

    async getByTeacherId(req: Request, res: Response) {
        const authorId = Array.isArray(req.params.authorId)
            ? req.params.authorId[0]
            : req.params.authorId;

        const classes = await classService.getByTeacherId(authorId);

        return res.json(classes);
    }
}

export default new ClassController();