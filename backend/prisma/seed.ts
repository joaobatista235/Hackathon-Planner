import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USERS = [
  {
    name: "Administrador",
    email: "admin@planner.dev",
    password: "planner123",
    role: "ADMIN" as const,
  },
  {
    name: "Professor Silva",
    email: "professor@planner.dev",
    password: "planner123",
    role: "USER" as const,
  },
];

async function main() {
  for (const u of USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });

    if (existing) {
      console.log(`  já existe: ${u.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, password: hashed, role: u.role },
    });
    console.log(`✓ ${user.role.padEnd(5)} | ${user.email}`);
  }

  console.log("\nCredenciais:");
  console.log("  admin@planner.dev    / planner123  (ADMIN)");
  console.log("  professor@planner.dev / planner123  (USER)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
