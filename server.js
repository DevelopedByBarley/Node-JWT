
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const connection = require('./config/database');
const authenticateToken = require('./middleware/userAuthentication')





app.use(express.json());

const posts = [
    {
        userName: "Kyle",
        title: "Post1"
    },
    {
        userName: "Jim",
        title: "Post2"
    },
    {
        userName: "Cartman",
        title: "Post13"
    },
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts)
})

app.post('/register', async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);
    const query = 'INSERT INTO `super_admin` (`s_adminId`, `userName`, `password`, `createdAt`) VALUES (NULL, ?, ?, current_timestamp())';
    const values = [userName, hashedPw];
    connection.query(query, values, function (err, results, fields) {
        if (err) throw err;
        console.log('Sikeres beszúrás!');
    });
})

app.post('/login', async (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;
    const query = 'SELECT * FROM `super_admin` WHERE `userName` = ?'

    connection.query(query, [userName], async function (err, results, fields) {

        const passwordIsValid = await bcrypt.compare(password, results[0].password);

        if (!passwordIsValid) return res.sendStatus(403);

        const user = { name: userName };


        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1m' });


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // itt további opciókat adhatsz meg a cookie-hoz, például expires, maxAge, stb.
        });
        res.json({ accessToken: accessToken })
    });
})


app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateAccessToken({user: user.name});
        res.json({accessToken:  accessToken});
    })
})

function generateAccessToken(user) { 
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}





app.listen(3000);