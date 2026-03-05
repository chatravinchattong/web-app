const express = require("express");
const session = require("express-session");
const path = require("path");

require("./db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(session({
    secret: "concert-secret",
    resave: false,
    saveUninitialized: true
}));

app.use("/", require("./routes/user"));
app.use("/", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});