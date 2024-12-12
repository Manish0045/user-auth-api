const router = require('express').Router();
const { signUpUser, verifyEmail } = require('../controllers/user.controller');

router
    .get('/user', (req, res) => { })
    .post('/signup', signUpUser)
    .post('/login', (req, res) => { })
    .get('/confirm-email', verifyEmail)
    .get('/profile', (req, res) => { })

module.exports = router;