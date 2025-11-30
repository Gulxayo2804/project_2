const users = require('../data/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error('Email and password required!')
            error.statusCode = 400;
            throw (error);
        }
        const user = users.find(t => t.email === email);
        if (user) {
            const err = new Error('User already exist');
            err.statusCode = 409;
            throw (err);
        }
        const hashed = bcrypt.hash(password);
        users.push({ email, password: hashed });
        res.status(201).json({ message: "Created" })
    } catch (error) {
        next(error)
    }

}

exports.login = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error('Email and password required!')
            error.statusCode = 400;
            throw (error);
        }
        const user = users.find(t => t.email === email);
        if (!user) {
            const err = new Error('User is not exit');
            err.statusCode = 404;
            throw (err);
        }
        const match = bcrypt.compare(password, user.password);
        if (match) {
            const error = new Error('Invalid input');
            error.statusCode = 401;
            throw (error)
        };

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token })
    } catch (error) {
        console.log(error)
        next(error)
    }
}