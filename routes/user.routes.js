const router = require('express').Router();
const {
    signUpUser,
    verifyEmail,
    loginUser
} = require('../controllers/user.controller');

router
    .post('/signup', signUpUser)
    .post('/login', loginUser)
    .get('/user', (req, res) => { })
    .get('/confirm-email', verifyEmail)
    .get('/profile', (req, res) => { })

module.exports = router;