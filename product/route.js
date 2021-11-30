const express = require('express');
let router = express.Router();
const { Product } = require('./controller');
const { auth } = require("../middlewares/auth");
const { roleID } = require("../middlewares/role")
const validation = require('./validation');

router.get('/', Product.index);
router.get('/:productId', Product.show);
router.post('/', auth, roleID, validation.create, Product.create);
router.put('/:productId', auth, roleID, validation.update, Product.update);
router.delete('/:productId', auth, roleID, Product.destroy);

module.exports = { router };