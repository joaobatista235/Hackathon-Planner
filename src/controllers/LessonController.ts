import {Request, Response} from 'express';
import lessonService from '@/services/LessonService';
import { getUserFromToken } from '@/utils/getUserFromToken';

class LessonController {
    async getAll(_req: Request, res: Response) {
        const lessons = await lessonService.getAll();
        return res.json(lessons);
    }

    async getById(req: Request, res: Response) {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const lessonData = await lessonService.getById(id);
        return res.json(lessonData);
    }

   async create(req: Request, res: Response) {
    const authorId = getUserFromToken(req);

    const { title, description, classId } = req.body;

    const newLesson = await lessonService.create({
        title,
        description,
        date: new Date(),

        class: {
            connect: {
                id: classId
            }
        },

        author: {
            connect: {
                id: authorId
            }
        }
    });

    return res.status(201).json(newLesson);
}

    async update(req: Request, res: Response) {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { title, description } = req.body;
        const updatedLesson = await lessonService.update(id, { title, description });
        return res.json(updatedLesson);
        
    }
    async delete(req: Request, res: Response) {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await lessonService.delete(id);
        return res.status(204).send();
    }
    async getByLessonId(req: Request, res: Response) {
        const classId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;
        const lessons = await lessonService.getByLessonId(classId);
        return res.json(lessons);
    }


}

export default new LessonController();