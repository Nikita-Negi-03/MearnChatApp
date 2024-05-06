const express = require('express');
const router = express.Router();
const users=require('../controllers/user');
const {auth}=require('../middleware/authMiddleware');

router.route('/register').post(users.registerUser)
router.post('/login', users.login)
router.get('/', auth , users.allUsers)

module.exports = router;