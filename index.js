// Andi Fauzan Hediantoro - 24110400010

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let students = [
  { id: 1, name: "Andi Saputra", nim: "231001", major: "Informatika", gpa: 3.75 },
  { id: 2, name: "Bella Kurnia", nim: "231002", major: "Sistem Informasi", gpa: 3.50 },
  { id: 3, name: "Candra Wijaya", nim: "231003", major: "Informatika", gpa: 3.20 },
];

let nextId = 4;

app.get("/students", (req, res) => {
  res.status(200).json(students);
});

app.get("/students/search", (req, res) => {
  const { major } = req.query;
  if (!major) {
    return res.status(400).json({ error: "Query parameter major wajib diisi" });
  }
  const result = students.filter((s) =>
    s.major.toLowerCase().includes(major.toLowerCase())
  );
  res.status(200).json(result);
});

app.get("/majors", (req, res) => {
  const majors = [...new Set(students.map((s) => s.major))].sort();
  res.status(200).json(majors);
});

app.get("/students/stats", (req, res) => {
  if (students.length === 0) {
    return res.status(200).json({
      total: 0,
      averageGpa: 0,
      highestGpa: null,
      lowestGpa: null,
      majors: {},
    });
  }

  const total = students.length;
  const totalGpa = students.reduce((sum, s) => sum + s.gpa, 0);
  const averageGpa = parseFloat((totalGpa / total).toFixed(2));
  const highestGpa = Math.max(...students.map((s) => s.gpa));
  const lowestGpa = Math.min(...students.map((s) => s.gpa));

  const majors = {};
  students.forEach((s) => {
    majors[s.major] = (majors[s.major] || 0) + 1;
  });

  res.status(200).json({
    total,
    averageGpa,
    highestGpa,
    lowestGpa,
    majors,
  });
});

app.get("/students/top-gpa", (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const sorted = [...students].sort((a, b) => b.gpa - a.gpa);
  const top = sorted.slice(0, Math.min(limit, sorted.length));
  res.status(200).json(top);
});

app.post("/students/bulk", (req, res) => {
  const { students: newStudents } = req.body;

  if (!Array.isArray(newStudents) || newStudents.length === 0) {
    return res.status(400).json({ error: "Kirim array 'students' dengan minimal satu data" });
  }

  const added = [];
  const errors = [];

  newStudents.forEach((s, i) => {
    if (!s.name || !s.nim || !s.major) {
      errors.push({ index: i, error: "name, nim, dan major wajib diisi" });
      return;
    }
    const student = {
      id: nextId,
      name: s.name,
      nim: s.nim,
      major: s.major,
      gpa: s.gpa ?? 0,
    };
    nextId++;
    students.push(student);
    added.push(student);
  });

  res.status(201).json({ added, errors: errors.length > 0 ? errors : undefined });
});

app.patch("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, nim, major, gpa } = req.body;

  if (name === undefined && nim === undefined && major === undefined && gpa === undefined) {
    return res.status(400).json({ error: "Kirim minimal satu field untuk di-update" });
  }

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }

  if (name !== undefined) students[index].name = name;
  if (nim !== undefined) students[index].nim = nim;
  if (major !== undefined) students[index].major = major;
  if (gpa !== undefined) students[index].gpa = gpa;

  res.status(200).json(students[index]);
});

app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }

  res.status(200).json(student);
});

app.post("/students", (req, res) => {
  const { name, nim, major, gpa } = req.body;

  if (!name || !nim || !major) {
    return res.status(400).json({ error: "name, nim, dan major wajib diisi" });
  }

  const newStudent = {
    id: nextId,
    name,
    nim,
    major,
    gpa: gpa ?? 0,
  };
  nextId++;

  students.push(newStudent);

  res.status(201).json(newStudent);
});

app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, nim, major, gpa } = req.body;

  if (name === undefined && nim === undefined && major === undefined && gpa === undefined) {
    return res.status(400).json({ error: "Kirim minimal satu field" });
  }

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }

  if (name !== undefined) students[index].name = name;
  if (nim !== undefined) students[index].nim = nim;
  if (major !== undefined) students[index].major = major;
  if (gpa !== undefined) students[index].gpa = gpa;

  res.status(200).json(students[index]);
});

app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }

  students.splice(index, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /students`);
  console.log(`  GET    /students/search?major=... (bonus)`);
  console.log(`  GET    /students/:id`);
  console.log(`  POST   /students`);
  console.log(`  PUT    /students/:id`);
  console.log(`  DELETE /students/:id`);
  console.log(`  ------- Bonus -------`);
  console.log(`  GET    /majors`);
  console.log(`  GET    /students/stats`);
  console.log(`  GET    /students/top-gpa?limit=N`);
  console.log(`  POST   /students/bulk`);
  console.log(`  PATCH  /students/:id`);
});
