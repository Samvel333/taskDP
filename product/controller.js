const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { connection } = require('../database/connection');

class Product {
    static index = async (req, res) => {
        connection.query('SELECT * FROM `products`', function (error, results) {
            if (error) return error;
            return res.status(StatusCodes.OK).json({ data: results });
        })
    }


    static show = async (req, res) => {
        connection.query('SELECT * FROM `products` WHERE id = ?', req.params.id, function (error, results) {
            if (error) return error;
            return res.status(StatusCodes.OK).json({ data: results });
        })
    }

    static create = (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            connection.query(`INSERT INTO products (user_id, title, price) VALUES ('${req.body.user_id}','${req.body.title}','${req.body.price}')`, (error) => {
                if (error) throw error;
            });
            return "Added!";
        }
        catch (error) {
            throw error;
        }
    }

    static update = (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            connection.query(`UPDATE products SET title='${req.body.title}',price='${req.body.price}' WHERE id=${req.params.id}`, (error) => {
                if (error) throw error;
            });
            return res.status(StatusCodes.OK).json({ message: "updated!" })
        }
        catch (e) {
            throw e;
        }
    }


    static destroy = (req, res) => {
        let sql = `DELETE FROM products WHERE id = ${req.params.id}`
        connection.query(sql, (err) => {
            if (err) throw err
        })
        return res.status(200).json({ message: 'success' });

    }
}
module.exports = { Product }