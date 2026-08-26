const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3003;
const JWT_SECRET = process.env.JWT_SECRET || "menhelyonline-dev-secret-key-2026";

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Adatbázis ──
const db = new Database(path.join(__dirname, "menhelyonline.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Táblák létrehozása ──
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'shelter', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shelters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    county TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    description TEXT,
    image TEXT,
    lat REAL,
    lng REAL,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelter_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    age TEXT,
    age_text TEXT,
    gender TEXT,
    size TEXT,
    coat TEXT,
    location TEXT,
    image TEXT,
    description TEXT,
    child_friendly INTEGER DEFAULT 0,
    transport_help INTEGER DEFAULT 0,
    indoor_outdoor TEXT DEFAULT 'mindkettő',
    gets_along_with_others INTEGER DEFAULT 1,
    vaccinated INTEGER DEFAULT 0,
    neutered INTEGER DEFAULT 0,
    pickup_line TEXT,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'pending', 'adopted')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
  );

  CREATE TABLE IF NOT EXISTS adoptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    shelter_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shelter_id) REFERENCES shelters(id)
  );
`);

// ── Auth middleware ──
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Nincs bejelentkezve" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Érvénytelen token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Nincs jogosultság" });
    }
    next();
  };
}

// ══════════════════════════════════════
//  AUTH API
// ══════════════════════════════════════

// Regisztráció
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, role = "user" } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Kötelező mezők: email, jelszó, név" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Ez az email már regisztrálva van" });
  }

  const hashedPassword = bcrypt.hashSync(password, 12);
  const result = db.prepare(
    "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)"
  ).run(email, hashedPassword, name, role === "shelter" ? "shelter" : "user");

  const token = jwt.sign(
    { id: result.lastInsertRowid, email, name, role: role === "shelter" ? "shelter" : "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: result.lastInsertRowid, email, name, role: role === "shelter" ? "shelter" : "user" } });
});

// Bejelentkezés
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Hibás email vagy jelszó" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Profil
app.get("/api/auth/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id, email, name, role, created_at FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// ══════════════════════════════════════
//  SHELTERS API
// ══════════════════════════════════════

// Összes menhely (nyilvános)
app.get("/api/shelters", (req, res) => {
  const shelters = db.prepare("SELECT * FROM shelters WHERE approved = 1").all();
  res.json(shelters);
});

// Menhely regisztráció (shelter role-al)
app.post("/api/shelters", authenticate, requireRole("shelter"), (req, res) => {
  const { name, location, county, phone, email, website, description, lat, lng } = req.body;

  const existing = db.prepare("SELECT id FROM shelters WHERE user_id = ?").get(req.user.id);
  if (existing) {
    return res.status(409).json({ error: "Már van menhelyed regisztrálva" });
  }

  const result = db.prepare(
    `INSERT INTO shelters (user_id, name, location, county, phone, email, website, description, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, name, location, county, phone, email, website, description, lat, lng);

  res.json({ id: result.lastInsertRowid, message: "Menhely létrehozva, jóváhagyásra vár" });
});

// Saját menhely adatai
app.get("/api/shelters/mine", authenticate, requireRole("shelter"), (req, res) => {
  const shelter = db.prepare("SELECT * FROM shelters WHERE user_id = ?").get(req.user.id);
  if (!shelter) return res.status(404).json({ error: "Nincs menhelyed" });
  res.json(shelter);
});

// ══════════════════════════════════════
//  ANIMALS API
// ══════════════════════════════════════

// Összes elérhető állat (nyilvános)
app.get("/api/animals", (req, res) => {
  const { species, shelter_id } = req.query;
  let query = "SELECT a.*, s.name as shelter_name FROM animals a LEFT JOIN shelters s ON a.shelter_id = s.id WHERE a.status = 'available'";
  const params = [];

  if (species) {
    query += " AND a.species = ?";
    params.push(species);
  }
  if (shelter_id) {
    query += " AND a.shelter_id = ?";
    params.push(shelter_id);
  }

  query += " ORDER BY a.created_at DESC";
  const animals = db.prepare(query).all(...params);
  res.json(animals);
});

// Egy állat részletei
app.get("/api/animals/:id", (req, res) => {
  const animal = db.prepare(
    "SELECT a.*, s.name as shelter_name, s.phone as shelter_phone, s.email as shelter_email FROM animals a LEFT JOIN shelters s ON a.shelter_id = s.id WHERE a.id = ?"
  ).get(req.params.id);
  if (!animal) return res.status(404).json({ error: "Állat nem található" });
  res.json(animal);
});

// Új állat feltöltése (menhelynek)
app.post("/api/animals", authenticate, requireRole("shelter", "admin"), (req, res) => {
  const shelter = db.prepare("SELECT id FROM shelters WHERE user_id = ?").get(req.user.id);
  if (!shelter) return res.status(403).json({ error: "Nincs menhelyed" });

  const {
    name, species, breed, age, age_text, gender, size, coat,
    location, image, description, child_friendly, transport_help,
    indoor_outdoor, gets_along_with_others, vaccinated, neutered, pickup_line
  } = req.body;

  const result = db.prepare(
    `INSERT INTO animals (shelter_id, name, species, breed, age, age_text, gender, size, coat,
     location, image, description, child_friendly, transport_help, indoor_outdoor,
     gets_along_with_others, vaccinated, neutered, pickup_line)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    shelter.id, name, species, breed, age, age_text, gender, size, coat,
    location, image, description, child_friendly ? 1 : 0, transport_help ? 1 : 0,
    indoor_outdoor || "mindkettő", gets_along_with_others ? 1 : 0,
    vaccinated ? 1 : 0, neutered ? 1 : 0, pickup_line
  );

  res.json({ id: result.lastInsertRowid, message: "Állat létrehozva" });
});

// Saját menhely állatai
app.get("/api/animals/mine", authenticate, requireRole("shelter", "admin"), (req, res) => {
  const shelter = db.prepare("SELECT id FROM shelters WHERE user_id = ?").get(req.user.id);
  if (!shelter) return res.status(403).json({ error: "Nincs menhelyed" });

  const animals = db.prepare("SELECT * FROM animals WHERE shelter_id = ? ORDER BY created_at DESC").all(shelter.id);
  res.json(animals);
});

// ══════════════════════════════════════
//  ADOPTIONS API
// ══════════════════════════════════════

// Örökbefogadás jelentkezés
app.post("/api/adoptions", authenticate, (req, res) => {
  const { animal_id, message } = req.body;

  const animal = db.prepare("SELECT * FROM animals WHERE id = ? AND status = 'available'").get(animal_id);
  if (!animal) return res.status(404).json({ error: "Az állat nem érhető el" });

  const existing = db.prepare(
    "SELECT id FROM adoptions WHERE animal_id = ? AND user_id = ? AND status = 'pending'"
  ).get(animal_id, req.user.id);
  if (existing) {
    return res.status(409).json({ error: "Már jelentkeztél erre az állatra" });
  }

  const result = db.prepare(
    "INSERT INTO adoptions (animal_id, user_id, shelter_id, message) VALUES (?, ?, ?, ?)"
  ).run(animal_id, req.user.id, animal.shelter_id, message);

  db.prepare("UPDATE animals SET status = 'pending' WHERE id = ?").run(animal_id);

  res.json({ id: result.lastInsertRowid, message: "Jelentkezés elküldve" });
});

// Menhely örökbefogadás kérelmei
app.get("/api/adoptions/mine", authenticate, requireRole("shelter"), (req, res) => {
  const shelter = db.prepare("SELECT id FROM shelters WHERE user_id = ?").get(req.user.id);
  if (!shelter) return res.status(403).json({ error: "Nincs menhelyed" });

  const adoptions = db.prepare(
    `SELECT ad.*, a.name as animal_name, a.image as animal_image, u.name as user_name, u.email as user_email
     FROM adoptions ad
     JOIN animals a ON ad.animal_id = a.id
     JOIN users u ON ad.user_id = u.id
     WHERE ad.shelter_id = ?
     ORDER BY ad.created_at DESC`
  ).all(shelter.id);

  res.json(adoptions);
});

// Örökbefogadás jóváhagyás/elutasítás
app.put("/api/adoptions/:id", authenticate, requireRole("shelter"), (req, res) => {
  const { status } = req.body; // "approved" vagy "rejected"

  const adoption = db.prepare(
    "SELECT ad.* FROM adoptions ad JOIN shelters s ON ad.shelter_id = s.id WHERE ad.id = ? AND s.user_id = ?"
  ).get(req.params.id, req.user.id);

  if (!adoption) return res.status(404).json({ error: "Nem található" });

  db.prepare("UPDATE adoptions SET status = ? WHERE id = ?").run(status, req.params.id);

  if (status === "approved") {
    db.prepare("UPDATE animals SET status = 'adopted' WHERE id = ?").run(adoption.animal_id);
    // Elutasított többi jelentkezés
    db.prepare("UPDATE adoptions SET status = 'rejected' WHERE animal_id = ? AND id != ? AND status = 'pending'")
      .run(adoption.animal_id, req.params.id);
  } else if (status === "rejected") {
    db.prepare("UPDATE animals SET status = 'available' WHERE id = ?").run(adoption.animal_id);
  }

  res.json({ message: `Örökbefogadás ${status === "approved" ? "jóváhagyva" : "elutasítva"}` });
});

// ══════════════════════════════════════
//  STATS API (nyilvános)
// ══════════════════════════════════════

app.get("/api/stats", (req, res) => {
  const totalAnimals = db.prepare("SELECT COUNT(*) as count FROM animals WHERE status = 'available'").get().count;
  const totalShelters = db.prepare("SELECT COUNT(*) as count FROM shelters WHERE approved = 1").get().count;
  const totalAdopted = db.prepare("SELECT COUNT(*) as count FROM adoptions WHERE status = 'approved'").get().count;

  res.json({ totalAnimals, totalShelters, totalAdopted });
});

// ── Szerver indítása ──
app.listen(PORT, () => {
  console.log(`🐾 MenhelyOnline backend fut: http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});
