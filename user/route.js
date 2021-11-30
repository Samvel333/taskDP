const express = require('express');
let router = express.Router();
const { User } = require('./controller');
const validation = require('./validation');
const { auth } = require("../middlewares/auth");

router.post('/register', validation.register, User.create);
router.post('/login', validation.login, User.login);
router.post('/activate/:authorization', User.activate);
router.put('/:id', auth, validation.update, User.update);
router.delete('/:id', auth, User.destroy);

module.exports = { router };