const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

prisma.user
  .delete({
    where: { id: 1 },
  })
  .catch((error) => {
    console.error("Error deleting user:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
