const express = require("express");
const router = express.Router();
const db = require("../db");

// หน้าแรก
router.get("/", (req, res) => {
    db.all("SELECT * FROM concerts", (err, concerts) => {
        res.render("user/home", { concerts });
    });
});

// ดูรายละเอียด
router.get("/concert/:id", (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM concerts WHERE id=?", [id], (err, concert) => {
        db.all("SELECT * FROM rounds WHERE concert_id=?", [id], (err, rounds) => {
            res.render("user/detail", { concert, rounds });
        });
    });
});

// จอง
router.post("/booking", (req, res) => {
    const { concert_id, round_id, quantity, customer_name, customer_email } = req.body;

    db.get("SELECT price FROM rounds WHERE id=?", [round_id], (err, round) => {

        const total_price = round.price * quantity;
        const created_at = new Date().toISOString();

        db.run(`
            INSERT INTO bookings
            (concert_id, round_id, customer_name, customer_email, quantity, total_price, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [concert_id, round_id, customer_name, customer_email, quantity, total_price, created_at],
        () => {
            res.send("Booking Success!");
        });

    });
});

module.exports = router;