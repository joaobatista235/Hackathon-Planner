import { Request, Response } from "express";
import usersService from "../services/UserService";

class UsersController {

  async getAll(_req: Request, res: Response) {
    const users = await usersService.getAll();
    return res.json(users);
  }

  async getById(req: Request, res: Response) {
  const id = req.params.id as string;
    const user = await usersService.getById(id);
    return res.json(user);
  }

  async getByEmail(req: Request, res: Response) {
    const email = req.params.email as string;
    const user = await usersService.getByEmail(email);
    return res.json(user);
  }


  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await usersService.create({
        name,
        email,
        password,
      });

      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Erro ao criar usuário" });
    }
  }

  async delete(req: Request, res: Response) {
  const id = req.params.id as string;

    const deleted = await usersService.delete(id);
    return res.json(deleted);
  }

async update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const data = req.body;

    const updatedUser = await usersService.update(id, data);

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
}


async login(req: Request, res: Response) {
  try{
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    const result = await usersService.login(email, password);
    return res.status(200).json(result);

  }catch (error: any) {
    return res.status(401).json({ message: error.message || "Credenciais Inválidas" });
  }

}
}
export default new UsersController();