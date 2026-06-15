import { Router } from "express";
import LessonController from "@/controllers/LessonController";

const router = Router();

/**
 * @swagger
 * /lessons:
 *   get:
 *     summary: Retorna todas as aulas
 *     tags:
 *       - Lessons
 *     responses:
 *       200:
 *         description: Lista de aulas
 */
router.get("/", LessonController.getAll);


/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Retorna uma aula pelo ID
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da aula
 *     responses:
 *       200:
 *         description: Aula encontrada
 *       404:
 *         description: Aula não encontrada
 */
router.get("/:id", LessonController.getById);

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Cria uma nova aula
 *     tags:
 *       - Lessons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introdução à Matemática
 *               description:
 *                 type: string
 *                 example: Conceitos básicos de números inteiros
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-06-09T08:00:00.000Z
 *               classId:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", LessonController.create);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Atualiza uma aula existente
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
 *       404:
 *         description: Aula não encontrada
 */
router.put("/:id", LessonController.update);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Exclui uma aula
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da aula
 *     responses:
 *       204:
 *         description: Aula excluída com sucesso
 *       404:
 *         description: Aula não encontrada
 */
router.delete("/:id", LessonController.delete);

export default router;