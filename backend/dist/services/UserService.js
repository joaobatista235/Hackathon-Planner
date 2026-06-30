"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/env");
const errorHandler_1 = require("@/middlewares/errorHandler");
const UserRepository_1 = __importDefault(require("@/repositories/UserRepository"));
class UserService {
    async getAll() {
        return UserRepository_1.default.getAll();
    }
    async getById(id) {
        return UserRepository_1.default.getById(id);
    }
    async getByEmail(email) {
        return UserRepository_1.default.getByEmail(email);
    }
    async create(data) {
        const emailExists = await UserRepository_1.default.getByEmail(data.email);
        if (emailExists) {
            throw new errorHandler_1.AppError("Email em uso", 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return UserRepository_1.default.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
    }
    async update(id, data) {
        if (data.email) {
            const emailExists = await UserRepository_1.default.getByEmail(data.email);
            if (emailExists && emailExists.id !== id) {
                throw new errorHandler_1.AppError("Email já em uso", 400);
            }
        }
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.email)
            updateData.email = data.email;
        if (data.password) {
            updateData.password = await bcrypt_1.default.hash(data.password, 10);
        }
        return UserRepository_1.default.update(id, updateData);
    }
    async delete(id) {
        return UserRepository_1.default.delete(id);
    }
    async login(email, password) {
        const user = await UserRepository_1.default.getByEmailWithPassword(email);
        if (!user) {
            throw new errorHandler_1.AppError("Credenciais inválidas", 401);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new errorHandler_1.AppError("Credenciais inválidas", 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: "1h" });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
}
exports.default = new UserService();
