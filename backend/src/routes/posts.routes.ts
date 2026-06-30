import { Router } from "express";

import PostsController from "@/controllers/PostsController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import {
  createPostSchema,
  searchPostSchema,
  updatePostSchema,
} from "@/schemas/post.schema";

const router = Router();

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca posts por palavra-chave
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de posts encontrados
 */
router.get(
  "/search",
  validate(searchPostSchema, "query"),
  PostsController.search,
);

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Retorna os posts de um autor específico
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         description: ID do autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts do autor retornada com sucesso
 */
router.get("/author/:authorId", PostsController.getMyPosts);

router.get("/", PostsController.getAll);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retorna um post pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post encontrado
 */
router.get("/:id", PostsController.getById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 */
router.post(
  "/",
  authenticate,
  validate(createPostSchema),
  PostsController.create,
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post existente
 */
router.put("/:id", validate(updatePostSchema), PostsController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Exclui um post
 */
router.delete("/:id", PostsController.delete);

export default router;
