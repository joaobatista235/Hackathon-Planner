"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const UserService_1 = __importDefault(require("@/services/UserService"));
class UserController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
            const users = await UserService_1.default.getAll();
            return res.json(users);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const user = await UserService_1.default.getById(id);
            return res.json(user);
        });
        this.getByEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const email = req.params.email;
            const user = await UserService_1.default.getByEmail(email);
            return res.json(user);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const user = await UserService_1.default.create(req.body);
            return res.status(201).json(user);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const updatedUser = await UserService_1.default.update(id, req.body);
            return res.status(200).json(updatedUser);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const deleted = await UserService_1.default.delete(id);
            return res.json(deleted);
        });
        this.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { email, password } = req.body;
            const result = await UserService_1.default.login(email, password);
            return res.status(200).json(result);
        });
    }
}
exports.default = new UserController();
