const router = require('express').Router();

router
    .get('/user', (req, res) => { })
    .post('/signup', (req, res) => { })
    .post('/login', (req, res) => { })
    .post('/verify-email', (req, res) => { })
    .get('/profile', (req, res) => { })

module.exports = { router };