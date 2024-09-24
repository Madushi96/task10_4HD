const express = require('express');
const path = require('path');
const argon2 = require('argon2');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
app.use(express.static('public_html'));


app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');


app.get('/login', (req, res) => {
    res.render('login', { title: 'Login Form' });
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Hash the password using Argon2
        const hash = await argon2.hash(password);

       
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                return res.status(500).send('Error saving user');
            }

            res.send('User registered successfully with encrypted password');
        });
    } catch (err) {
        res.status(500).send('Error encrypting password');
    }
});

app.get('/users', (req, res) => {
    
    db.all('SELECT username, password FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving users');
        }

        
        res.render('users', { users: rows ,  title: 'Users list' });
    });
});



app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
