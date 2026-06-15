import { Router } from "express";
import ClassController from "@/controllers/ClassController";

const router = Router();

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Retorna todas as turmas
 *     tags:
 *       - Classes
 *     responses:
 *       200:
 *         description: Lista de turmas
 */
router.get("/", ClassController.getAll);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Retorna uma turma pelo ID
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada
 *       404:
 *         description: Turma não encontrada
 */
router.get("/:id", ClassController.getById);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Cria uma nova turma
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Turma A
 *               subject:
 *                 type: string
 *                 example: Matemática
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", ClassController.create);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Atualiza uma turma existente
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       404:
 *         description: Turma não encontrada
 */
router.put("/:id", ClassController.update);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Exclui uma turma
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da turma
 *     responses:
 *       204:
 *         description: Turma excluída com sucesso
 *       404:
 *         description: Turma não encontrada
 */
router.delete("/:id", ClassController.delete);

/**
 * @swagger
 * /classes/author/{authorId}:
 *   get:
 *     summary: Retorna as turmas de um professor
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de turmas do professor
 *       404:
 *         description: Professor não encontrado
 */
router.get("/author/:authorId", ClassController.getByTeacherId);


router.get("/teste", (_req, res) => {
  res.json({ ok: true });
});
export default router;