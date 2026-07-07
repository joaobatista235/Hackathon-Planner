import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@planner.dev";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Usuário já existe: ${email}`);
    return;
  }

  const password = await bcrypt.hash("planner123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      password,
      role: "ADMIN",
    },
  });

  console.log(`✓ Usuário criado: ${user.email} (role: ${user.role})`);
  console.log(`  Email: ${email}`);
  console.log(`  Senha: planner123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
