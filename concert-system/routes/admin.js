const express = require("express");
const router = express.Router();
const db = require("../db");

function checkAdmin(req, res, next) {
    if (!req.session.admin) return res.redirect("/login");
    next();
}

// Dashboard
router.get("/dashboard", checkAdmin, (req, res) => {

    db.get("SELECT COUNT(*) as total FROM concerts", (err, concerts) => {
        db.get("SELECT COUNT(*) as total FROM bookings", (err, bookings) => {
            db.get("SELECT SUM(total_price) as total FROM bookings", (err, sales) => {

                const data = {
                    totalConcerts: concerts.total,
                    totalBookings: bookings.total,
                    totalSales: sales.total || 0
                };

                res.render("admin/dashboard", { data });
            });
        });
    });
});

// Popular report
router.get("/report/popular", checkAdmin, (req, res) => {

    const sql = `
        SELECT concerts.name, COUNT(bookings.id) as booking_count
        FROM bookings
        JOIN concerts ON bookings.concert_id = concerts.id
        GROUP BY concerts.id
        ORDER BY booking_count DESC
    `;

    db.all(sql, (err, rows) => {
        res.render("admin/report", { rows });
    });
});

module.exports = router;