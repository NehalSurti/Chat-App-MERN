const express = require("express");
const { register, login, setAvatar, getAllUsers} = require("../controllers/usersController");
const router = express.Router();

router
.post('/register',register)
.post('/login',login)
.post('/setAvatar/:id',setAvatar)
.get('/allusers/:id',getAllUsers);

module.exports = router;