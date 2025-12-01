const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/user.json');

function readUsers() {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

exports.signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password required!');
            error.statusCode = 400;
            throw error;
        }

        let users = readUsers();

        const exists = users.find(u => u.email === email);
        if (exists) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            email,
            password: hashed
        };

        users.push(newUser);
        writeUsers(users);

        res.status(201).json({ message: "User created" });

    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password required!');
            error.statusCode = 400;
            throw error;
        }

        let users = readUsers();

        const user = users.find(u => u.email === email);
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            throw error;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        next(error);
    }
};
