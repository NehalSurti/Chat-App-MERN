const express = require("express");
const { addMessage, getAllMessage} = require("../controllers/messagesController");
const router = express.Router();

router
.post('/addmsg',addMessage)
.post('/getmsg',getAllMessage);

module.exports = router;