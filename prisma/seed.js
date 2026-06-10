const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.student.deleteMany();

  await prisma.student.createMany({
    data: [
      { name: "Andi Saputra", nim: "231001", major: "Informatika", gpa: 3.75 },
      { name: "Bella Kurnia", nim: "231002", major: "Sistem Informasi", gpa: 3.50 },
      { name: "Candra Wijaya", nim: "231003", major: "Informatika", gpa: 3.20 },
      { name: "Dewi Rahayu", nim: "231004", major: "Informatika", gpa: 3.90 },
      { name: "Eko Prasetyo", nim: "231005", major: "Sistem Informasi", gpa: 3.45 },
      { name: "Fitri Handayani", nim: "231006", major: "Teknik Komputer", gpa: 3.60 },
      { name: "Gilang Ramadhan", nim: "231007", major: "Teknik Komputer", gpa: 3.10 },
      { name: "Hana Safitri", nim: "231008", major: "Informatika", gpa: 3.85 },
    ],
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
