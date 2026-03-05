const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("concert.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS concerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            artist TEXT,
            description TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concert_id INTEGER,
            date TEXT,
            time TEXT,
            price INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concert_id INTEGER,
            round_id INTEGER,
            customer_name TEXT,
            customer_email TEXT,
            quantity INTEGER,
            total_price INTEGER,
            created_at TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `);

    // default admin
    db.run(`
        INSERT OR IGNORE INTO admins (id, username, password)
        VALUES (1, 'admin', '1234')
    `);
});

module.exports = db;