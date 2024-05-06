const express = require('express');
const router = express.Router();
const mesaages = require('../controllers/messages')
const {auth}=require('../middleware/authMiddleware');

router.post('/', auth, mesaages.sendMessage)
router.get('/:chatId', auth, mesaages.allMessages)

module.exports = router;