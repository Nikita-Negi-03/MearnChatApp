const express = require('express');
const router = express.Router();
const chat=require('../controllers/chat');
const {auth}=require('../middleware/authMiddleware');

router.post('/', auth, chat.accessChat)
router.get('/', auth , chat.fetchChats)
router.post('/group', auth , chat.createGroupChat)
router.put('/rename', auth , chat.renameGroup)
router.put('/groupremove', auth , chat.removeFromGroup)
router.put('/groupadd', auth , chat.addToGroup)

module.exports = router;