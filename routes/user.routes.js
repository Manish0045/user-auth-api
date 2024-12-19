const router = require('express').Router();
const {
    signUpUser,
    verifyEmail,
    loginUser,
    getCurrentUser,
    getProfile,
    deleteUser,
    signOutUser,
    updateUser
} = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

router
    .post('/signup', signUpUser)
    .post('/login', loginUser)
    .get('/confirm-email', verifyEmail)
    .get('/get-user', verifyJWT, getCurrentUser)
    .get('/profile', verifyJWT, getProfile)
    .post('/sign-out', verifyJWT, signOutUser)
    .put('/update/:userId', verifyJWT, updateUser)
    .delete('/delete/:userId', verifyJWT, deleteUser)

module.exports = router;