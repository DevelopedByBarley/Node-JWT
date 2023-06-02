
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



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
    res.json(posts.filter(post => post.userName === req.user.name))
})

app.post('/login', (req, res) => {
    // Authenticate user

    const userName = req.body.userName;
    const user = { name: userName };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.json({ accessToken: accessToken })
})



//Middleware

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];   

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}

app.listen(3000);