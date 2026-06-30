import userRepository from '../repositories/UserRepository';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsersService {
  async getAll() {
    return userRepository.getAll();
    
  }

    async getById(id: string) {
        return userRepository.getById(id);
    }

    async getByEmail(email: string) {
        return userRepository.getByEmail(email);
    }

    async create(data: { name: string; email: string; password: string; }) {
      const emailExists = await userRepository.getByEmail(data.email);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      if (emailExists) {
        throw new Error('Email em uso');
      }

      return userRepository.create({
        ...data,
        password: hashedPassword,
      });


    }

    async update(id: string, data: { name?: string; email?: string; password?: string }) {
      if (data.email) {
        const emailExists = await userRepository.getByEmail(data.email);
        if (emailExists && emailExists.id !== id) {
          throw new Error('Email já em uso');
        }
      }
    }

    async delete(id: string) {
        return userRepository.delete(id);
    }

    async login(email: string, password: string) {
  const user = await userRepository.getByEmailWithPassword(email);
console.log("USER:", user);
  console.log("EMAIL RECEBIDO:", email);
  console.log("HASH NO BANCO:", user?.password);

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log("PASSWORD MATCH:", passwordMatch);

  if (!passwordMatch) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
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
export default new UsersService();