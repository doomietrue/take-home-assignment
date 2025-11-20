// prisma/seed.ts
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const USERS: Array<{ email: string; password: string; role: Role }> = [
  {
    email: "admin@demo.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    email: "reviewer@demo.com",
    password: "reviewer123",
    role: "REVIEWER",
  },
];

async function main() {
  for (const user of USERS) {
    const passwordHash = await bcrypt.hash(user.password, 12);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        role: user.role,
      },
      create: {
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
  }

  console.log("Seeded admin users:");
  USERS.forEach((user) => {
    console.log(`- ${user.email} (${user.role})`);
  });
}

main()
  .catch((error) => {
    console.error("Failed to seed data", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

