const { body } = require('express-validator');
const create = [
    body('title')
        .notEmpty().isLength({ min: 3 }).withMessage('Min lenght is 3'),
    body('price')
        .notEmpty().withMessage('Field is required')
];
const update = [
    body('title')
        .notEmpty().isLength({ min: 3 }).withMessage('Min lenght is 3'),
    body('price')
        .notEmpty().withMessage('Field is required')
];
module.exports = { create, update }