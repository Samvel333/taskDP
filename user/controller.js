let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connection } = require('../database/connection');

let { JWT_SECRET } = process.env;
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { UserService } = require('./service');



class User {
    // Registration
    static create = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.message });
        }

        let token = jwt.sign({ email: req.body.email }, JWT_SECRET);
        let hashPassword = bcrypt.hashSync(req.body.password, 7);

        try {
            let data = new Promise((resolve, reject) => {
                connection.query('INSERT INTO users (name, email, password, token) VALUES (?,?,?,?)',
                    [req.body.name, req.body.email, hashPassword, token], function (error) {
                        if (error) reject(error);
                    });
            });

            return res.status(201).json({ message: 'success', data: { id: await data.insertId } });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'error', data: error.message });
        }
    }

    // login
    static login = async (req, res) => {
        let { email, password } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.array() });
        }

        let user = await UserService.getActiveUser(email);
        let isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Wrong Email or Password!" });
        }

        let token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            data: { token, expiresIn: 3600 }
        });
    }

    // Update user by id
    static update = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        let hashPassword = bcrypt.hashSync(req.body.password, 7);

        connection.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', password='${hashPassword}' WHERE id='${id}'`,
            function (error) {
                if (error) throw error;
            });

        return res.status(StatusCodes.OK).json({ message: 'Updated!' });
    }

    //Activate
    static activate = async (req, res) => {
        let token = req.params.authorization;
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Activation link is invalid" });
        }
        let email = jwt.verify(token, JWT_SECRET).email;
        let user = await UserService.getUserByEmail(email);
        if (user.hasOwnProperty("id")) {
            if (user.token !== token) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Token" });
            }
            if (user.status === "active") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "User is active" });
            }
            connection.query(`UPDATE users SET status = 'active' WHERE email = '${req.body.email}'`,
                function (error) {
                    if (error) throw error;
                });
            return res.status(StatusCodes.OK).json({ message: 'Activated!' });;
        }
    }

    // Delete user by id
    static destroy = function (req, res) {
        let sql = `DELETE FROM users WHERE id = ${req.params.id}`
        connection.query(sql, (err) => {
            if (err) throw err
        })
        return res.status(200).json({ message: 'success' });
    }
}

module.exports = { User }