const jwt = require('jsonwebtoken');
const users = require('../data/user');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header.authorization;
        if (!authHeader) {
            const err = new Error('Not token provided');
            err.statusCode = 401;
            throw (err)
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(t => t.email === decoded.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            throw (err)
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}