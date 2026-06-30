"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PostsController_1 = __importDefault(require("@/controllers/PostsController"));
const authenticate_1 = require("@/middlewares/authenticate");
const validate_1 = require("@/middlewares/validate");
const post_schema_1 = require("@/schemas/post.schema");
const router = (0, express_1.Router)();
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
router.get("/search", (0, validate_1.validate)(post_schema_1.searchPostSchema, "query"), PostsController_1.default.search);
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
router.get("/author/:authorId", PostsController_1.default.getMyPosts);
router.get("/", PostsController_1.default.getAll);
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
router.get("/:id", PostsController_1.default.getById);
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
router.post("/", authenticate_1.authenticate, (0, validate_1.validate)(post_schema_1.createPostSchema), PostsController_1.default.create);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post existente
 */
router.put("/:id", (0, validate_1.validate)(post_schema_1.updatePostSchema), PostsController_1.default.update);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Exclui um post
 */
router.delete("/:id", PostsController_1.default.delete);
exports.default = router;
