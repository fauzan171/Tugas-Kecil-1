# Tugas Kecil 1 — Student API

REST API untuk manajemen data mahasiswa dibuat pakai Node.js dan Express.

## Cara Jalain

```bash
npm install
node index.js
```

Server jalan di `http://localhost:3000`

## Endpoint

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/students` | Ambil semua data mahasiswa |
| GET | `/students/:id` | Ambil satu mahasiswa berdasarkan id |
| POST | `/students` | Tambah mahasiswa baru |
| PUT | `/students/:id` | Update data mahasiswa |
| DELETE | `/students/:id` | Hapus mahasiswa |
| GET | `/students/search?major=...` | Filter mahasiswa berdasarkan major |
| GET | `/majors` | Ambil daftar semua major |
| GET | `/students/stats` | Statistik mahasiswa |
| GET | `/students/top-gpa?limit=N` | Top mahasiswa berdasarkan GPA |
| POST | `/students/bulk` | Tambah banyak mahasiswa sekaligus |
| PATCH | `/students/:id` | Update parsial data mahasiswa |

## Contoh Request

**Tambah mahasiswa:**

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Dewi Rahayu","nim":"231004","major":"Informatika","gpa":3.9}'
```

**Update GPA:**

```bash
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"gpa":4.0}'
```

**Cari berdasarkan major:**

```bash
curl "http://localhost:3000/students/search?major=Informatika"
```

## Bonus Prisma

Buat jalain versi Prisma (pakai database MySQL):

```bash
npm install @prisma/client prisma
npx prisma migrate dev --name init
npx prisma db seed
node index.prisma.js
```

Server Prisma jalan di port `3001`.

## Struktur File

```
├── index.js            ← API utama (in-memory)
├── index.prisma.js     ← Bonus refactor ke Prisma
├── prisma/
│   ├── schema.prisma   ← Schema database
│   └── seed.js         ← Data awal
├── .env                ← Config database
├── .env.example        ← Template config
└── package.json
```
