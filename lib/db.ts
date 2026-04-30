import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "inventory.sqlite");
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('IN','OUT')) NOT NULL,
  material TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  location TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
`);

const seedCount = db.prepare("SELECT COUNT(*) AS count FROM materials").get() as { count: number };
if (seedCount.count === 0) {
  const insert = db.prepare("INSERT INTO materials (name) VALUES (?)");
  ["Steel", "Plastic", "Aluminum", "Copper"].forEach((name) => insert.run(name));
}

export type Movement = {
  id: number;
  type: "IN" | "OUT";
  material: string;
  quantity: number;
  location: string;
  note: string | null;
  created_at: string;
};

export default db;
