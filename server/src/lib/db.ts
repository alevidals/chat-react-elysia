import { Database } from "bun:sqlite";

export const db = new Database();

export function initDb() {
  console.log("👋🏼 Seeding database...");

  console.log("🙎 Creating users table...");

  db.query(
    `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT
  )
`
  ).run();

  console.log("   Inserting users...");

  db.query("INSERT INTO users (username) VALUES (?)").run("Alice");
  db.query("INSERT INTO users (username) VALUES (?)").run("Bob");
  db.query("INSERT INTO users (username) VALUES (?)").run("Charlie");

  console.log("💬 Creating conversations table...");

  db.query(
    `
  CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    user_a_id INTEGER,
    user_b_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
  ).run();

  console.log("   Inserting conversations...");

  db.query(
    "INSERT INTO conversations (user_a_id, user_b_id) VALUES (?, ?)"
  ).run(1, 2);
  db.query(
    "INSERT INTO conversations (user_a_id, user_b_id) VALUES (?, ?)"
  ).run(2, 3);
  db.query(
    "INSERT INTO conversations (user_a_id, user_b_id) VALUES (?, ?)"
  ).run(3, 1);

  console.log("🪧 Creating messages table...");

  db.query(
    `
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER,
    sender_id INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
  ).run();

  console.log("   Inserting messages...");

  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(1, 1, "Hello, Bob!");
  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(1, 2, "Hello, Alice!");
  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(2, 2, "Hello, Charlie!");
  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(2, 3, "Hello, Bob!");
  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(3, 3, "Hello, Alice!");
  db.query(
    "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)"
  ).run(3, 1, "Hello, Charlie!");

  console.log("✅ Seeding complete!\n");
}
