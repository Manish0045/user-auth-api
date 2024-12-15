const router = require('express').Router();
const {
    signUpUser,
    verifyEmail,
    loginUser,
    getCurrentUser
} = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

router
    .post('/signup', signUpUser)
    .post('/login', loginUser)
    .get('/get-user', verifyJWT, getCurrentUser)
    .get('/confirm-email', verifyEmail)
    .get('/profile', (req, res) => { })

module.exports = router;