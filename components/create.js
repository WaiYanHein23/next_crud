const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

prisma.user
  .create({
    data: {
      username: " Bob",
      email: "hwaiyan913@gmail.com",
    },
  })
  .then(() => {
    console.log("Inserted User ");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
