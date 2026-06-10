// Andi Fauzan Hediantoro - 24110400010

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(express.json());

app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: "asc" },
    });
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/students/search", async (req, res) => {
  try {
    const { major } = req.query;
    if (!major) {
      return res.status(400).json({ error: "Query parameter major wajib diisi" });
    }
    const result = await prisma.student.findMany({
      where: {
        major: { contains: major },
      },
      orderBy: { name: "asc" },
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/majors", async (req, res) => {
  try {
    const result = await prisma.student.findMany({
      select: { major: true },
      distinct: ["major"],
      orderBy: { major: "asc" },
    });
    const majors = result.map((r) => r.major);
    res.json(majors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/students/stats", async (req, res) => {
  try {
    const total = await prisma.student.count();
    if (total === 0) {
      return res.json({ total: 0, averageGpa: 0, highestGpa: null, lowestGpa: null, majors: {} });
    }

    const agg = await prisma.student.aggregate({
      _avg: { gpa: true },
      _max: { gpa: true },
      _min: { gpa: true },
    });

    const grouped = await prisma.student.groupBy({
      by: ["major"],
      _count: { id: true },
    });

    const majors = {};
    grouped.forEach((g) => { majors[g.major] = g._count.id; });

    res.json({
      total,
      averageGpa: parseFloat(agg._avg.gpa.toFixed(2)),
      highestGpa: agg._max.gpa,
      lowestGpa: agg._min.gpa,
      majors,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/students/top-gpa", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const top = await prisma.student.findMany({
      orderBy: { gpa: "desc" },
      take: limit,
    });
    res.json(top);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/students/bulk", async (req, res) => {
  try {
    const { students: newStudents } = req.body;
    if (!Array.isArray(newStudents) || newStudents.length === 0) {
      return res.status(400).json({ error: "Kirim array 'students' dengan minimal satu data" });
    }

    const data = newStudents.map((s) => ({
      name: s.name,
      nim: s.nim,
      major: s.major,
      gpa: s.gpa ?? 0,
    }));

    const result = await prisma.student.createMany({ data, skipDuplicates: true });
    res.status(201).json({ added: result.count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nim, major, gpa } = req.body;

    if (name === undefined && nim === undefined && major === undefined && gpa === undefined)
      return res.status(400).json({ error: "Kirim minimal satu field untuk di-update" });

    const data = {};
    if (name  !== undefined) data.name  = name;
    if (nim   !== undefined) data.nim   = nim;
    if (major !== undefined) data.major = major;
    if (gpa   !== undefined) data.gpa   = gpa;

    const updated = await prisma.student.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Student tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return res.status(404).json({ error: "Student tidak ditemukan" });
    }

    res.json(student);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, nim, major, gpa } = req.body;
    if (!name || !nim || !major)
      return res.status(400).json({ error: "name, nim, dan major wajib diisi" });

    const student = await prisma.student.create({
      data: { name, nim, major, gpa: gpa ?? 0 },
    });
    res.status(201).json(student);
  } catch (e) {
    if (e.code === "P2002")
      return res.status(409).json({ error: "NIM sudah dipakai" });
    res.status(500).json({ error: e.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nim, major, gpa } = req.body;

    if (name === undefined && nim === undefined &&
        major === undefined && gpa === undefined)
      return res.status(400).json({ error: "Kirim minimal satu field" });

    const data = {};
    if (name  !== undefined) data.name  = name;
    if (nim   !== undefined) data.nim   = nim;
    if (major !== undefined) data.major = major;
    if (gpa   !== undefined) data.gpa   = gpa;

    const updated = await prisma.student.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Student tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.student.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Student tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`[BONUS] Prisma server on http://localhost:${PORT}`);
});
