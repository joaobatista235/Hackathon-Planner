import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "@/env";
import { AppError } from "@/middlewares/errorHandler";
import userRepository from "@/repositories/UserRepository";

class UserService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id: string) {
    return userRepository.getById(id);
  }

  async getByEmail(email: string) {
    return userRepository.getByEmail(email);
  }

  async create(data: { name: string; email: string; password: string }) {
    const emailExists = await userRepository.getByEmail(data.email);

    if (emailExists) {
      throw new AppError("Email em uso", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
  }

  async update(
    id: string,
    data: { name?: string; email?: string; password?: string },
  ) {
    if (data.email) {
      const emailExists = await userRepository.getByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new AppError("Email já em uso", 400);
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return userRepository.update(id, updateData);
  }

  async delete(id: string) {
    return userRepository.delete(id);
  }

  async login(email: string, password: string) {
    const user = await userRepository.getByEmailWithPassword(email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1h" },
    );

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

export default new UserService();
