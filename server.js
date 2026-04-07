const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',      
    database: 'shreyami_db'
});

app.post('/api/auth', (req, res) => {
    const { type, email, password, name } = req.body;
    

    if (type === 'signup') {
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, password], (err, result) => {
            if (err) return res.json({ success: false, message: "Email already exists!" });
            res.json({ success: true, user: name });
        });
    } else {
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (results.length > 0) {
                res.json({ success: true, user: results[0].name });
            } else {
                res.json({ success: false, message: "Wrong email or password!" });
            }
        });
    }
});


app.listen(5000, () => console.log("Server running ............................"));