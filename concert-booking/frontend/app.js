const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const response = await fetch('http://localhost:3000/api/concerts');
    const concerts = await response.json();

    res.render('home', { concerts });
});

// หน้า login
// ======================
// AUTH PAGES
// ======================

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        cssFile: 'auth/login.css'
    });
});

app.post('/login', async (req, res) => {

    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: "include",
        body: new URLSearchParams(req.body),
        credentials: "include"
    });

    const result = await response.json();

    if (result.success) {
            if (result.role === "admin") {
                return res.redirect("http://localhost:3000/admin/dashboard");
            } else {
                return res.redirect("/home");
            }
        } else {
            return res.redirect("/login");
    }
});

app.get('/register', (req, res) => {
    res.render('register',{
        title: 'register',
        cssFile: 'auth/register.css'
    });
});

app.post('/api/register', (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "กรอกข้อมูลให้ครบ"
        });
    }

    db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, 'user'],
        function(err) {

            if (err) {
                return res.json({
                    success: false,
                    message: "Username already exists"
                });
            }

            res.json({ success: true });
        }
    );

});

app.get('/home', async (req, res) => {

    const response = await fetch("http://localhost:3000/api/concerts");
    const concerts = await response.json();

    res.render('user/home', {
    title: 'Home',
    cssFile: 'user/home.css',
    concerts
    });

});

app.get('/concert/:id', async (req, res) => {

    const response = await fetch(`http://localhost:3000/api/concert/${req.params.id}`);
    const data = await response.json();

    console.log(data); // 👈 เพิ่มบรรทัดนี้

    res.render('user/showtimes', {
    title: 'Showtimes',
    cssFile: 'user/showtimes.css',
    concertName: data.concertName,
    showtimes: data.showtimes
    });

});

app.get('/booking/:showtimeId', async (req, res) => {

    const showtimeId = req.params.showtimeId;

    try {

        const response = await fetch(`http://localhost:3000/api/seats/${showtimeId}`);
        const data = await response.json();

        res.render('user/booking', {
            title: 'เลือกที่นั่ง',
            cssFile: 'user/booking.css',
            seats: data.seats,
            showtimeId: showtimeId,
            price: data.price
        });

    } catch (error) {
        console.error(error);
        res.send("เกิดข้อผิดพลาดในการโหลดที่นั่ง",);
    }

});

app.post('/booking/:showtimeId', async (req, res) => {

    const showtimeId = req.params.showtimeId;

    try {

        console.log("Calling backend booking API...");

        const response = await fetch(`http://localhost:3000/api/booking/${showtimeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': req.headers.cookie || ''
            },
            body: new URLSearchParams(req.body)
        });

        // ✅ ใส่ตรงนี้
        if (response.status === 401) {
            return res.redirect('/login');
        }

        if (!response.ok) {
            return res.send("Booking API error");
        }

        const result = await response.json();

        if (result.success) {
            return res.redirect('/booking-success');
        } else {
            return res.send(result.message);
        }

    } catch (error) {
        console.error(error);
        res.send("เกิดข้อผิดพลาดในการจอง");
    }

});

// app.get('/booking-success', (req, res) => {
//     res.send(`
//         <h1>🎉 จองสำเร็จ!</h1>
//         <p>กำลังพาไป My Booking...</p>
//         <script>
//             setTimeout(() => {
//                 window.location.href = "/my-bookings";
//             }, 3000);
//         </script>
//     `);
// });

app.get('/booking-success', (req, res) => {
    res.render('user/booking-success', {
        title: 'Booking Success',
        cssFile: 'success.css'
    });
});

app.get('/my-bookings', async (req, res) => {

    const response = await fetch("http://localhost:3000/api/my-bookings", {
        headers: {
            Cookie: req.headers.cookie || ""
        }
    });

    if (!response.ok) {
        const text = await response.text();
        console.log("Backend returned:", text);
        return res.redirect('/login');
    }

    const data = await response.json();

    res.render('user/my-bookings', {
        title: 'My Booking',
        cssFile: 'user/my-bookings.css',
        bookings: data.bookings || []
    });
});


app.listen(5000, () => {
    console.log('Frontend running on http://localhost:5000');
});