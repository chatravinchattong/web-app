const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/login", (req, res) => {
    res.render("admin/login");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM admins WHERE username=? AND password=?",
        [username, password],
        (err, admin) => {
            if (admin) {
                req.session.admin = admin;
                res.redirect("/admin/dashboard");
            } else {
                res.send("Login Failed");
            }
        }
    );
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;