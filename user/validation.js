const { body } = require('express-validator');
const { UserService } = require('./service');

const register = [
    body('name').notEmpty().isLength({ min: 4 }).withMessage('Min lenght is 4'),
    body("email").isEmail().custom(async (value) => {
        let data = await UserService.getUserByEmail(value);
        if (data && data.hasOwnProperty("id")) {
            return Promise.reject('Email is already in use');
        }
        return true;
    }),
    body('password')
        .notEmpty()
        .isLength({ min: 3 }).withMessage('Min lenght is 3')

];
const update = [
    body('name').notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body('gender').isEmpty().isIn(['male', 'female', '']),
    body('dob').notEmpty().isDate()
];

const login = [
    body('email').notEmpty(),
    body("password").notEmpty(),
    body("email").custom(async (value) => {
        let data = await UserService.getActiveUser(value);
        if (data && data.hasOwnProperty("id")) {
            return true;
        }
        return Promise.reject('User not found or is not active');
    })
]
module.exports = {register, login, update}