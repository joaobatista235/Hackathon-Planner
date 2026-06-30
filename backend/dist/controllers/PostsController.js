"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const PostsService_1 = __importDefault(require("@/services/PostsService"));
class PostsController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
            const posts = await PostsService_1.default.getAll();
            return res.json(posts);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = Number(req.params.id);
            const post = await PostsService_1.default.getById(id);
            return res.json(post);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, content } = req.body;
            const newPost = await PostsService_1.default.create({
                title,
                content,
                authorId: req.userId,
            });
            return res.status(201).json(newPost);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = Number(req.params.id);
            const { title, content, authorId } = req.body;
            const updated = await PostsService_1.default.update(id, { title, content, authorId });
            return res.json(updated);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = Number(req.params.id);
            const deleted = await PostsService_1.default.delete(id);
            return res.json(deleted);
        });
        this.search = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { q } = req.query;
            const posts = await PostsService_1.default.search(String(q));
            return res.json(posts);
        });
        this.getMyPosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const authorId = req.params.authorId;
            const posts = await PostsService_1.default.getByAuthorId(authorId);
            return res.json(posts);
        });
    }
}
exports.default = new PostsController();
