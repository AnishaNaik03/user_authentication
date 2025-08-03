const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'verify_db'
});

exports.register = async (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordconfirm } = req.body;

    // 1. Check if email already exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('register.ejs', {
                message: 'Database error'
            });
        }

        // ❌ Fix this condition - should be results.length > 0
        if (results.length > 0) {
            return res.render('register.ejs', {
                message: 'That email is already in use'
            });
        }

        // 2. Check if passwords match
        if (password !== passwordconfirm) {
            return res.render('register.ejs', {
                message: 'Passwords do not match'
            });
        }

        // 3. Hash password (❌ you passed 0 instead of salt rounds)
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // 4. Insert into DB
        db.query('INSERT INTO users SET ?', { username: name, email_verified: email, password: hashedPassword }, (error, result) => {
            if (error) {
                console.log(error);
                return res.render('register.ejs', {
                    message: 'Registration failed'
                });
            } else {
                return res.render('register.ejs', {
                    message: 'User registered successfully'
                });
            }
        });
    });
};
