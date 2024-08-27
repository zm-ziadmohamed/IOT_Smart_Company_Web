const userModel = require("../models/user");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { hashCompare, JWTCreate , isNotLoggedIn , isLoggedIn, hashPassword } = require('../security')

// Middleware for error handling
function handleErrors(req, res, errors, redirectUrl) {
    req.flash('errors', errors);
    res.redirect(redirectUrl);
}

// Utility function for setting cookies
function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite: 'strict', // Helps prevent CSRF attacks
    });
}

// Validate user input
const validateLoginInput = [
    check('username').notEmpty().isString().withMessage("Please Enter A Valid Username"),
    check('password').notEmpty().withMessage("Please Enter Your Password")
];

// Authenticate user
async function authenticateUser(username, password) {
    const user = await userModel.findOne({ username });
    if (!user || !hashCompare(password, user.password)) {
        return null;
    }
    return user;
}

/* GET login page. */
router.get('/login', isNotLoggedIn, (req, res, next) => {
    const errors = req.flash('errors'); // Assuming you use connect-flash or similar
    res.render('login', { errors });
});

router.post('/login', isNotLoggedIn, validateLoginInput, async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return handleErrors(req, res, errors, '/login');
    }

    try {
        const { username, password } = req.body;
        const user = await authenticateUser(username, password);
        if (!user) {
            errors.push({ msg: "Username or password incorrect" });
            return handleErrors(req, res, errors, '/login');
        }
        const token = JWTCreate({ id: user._id });
        setAuthCookie(res, token);
        res.redirect('/employees');
        
    } catch (error) {
        console.error("Login Error: ", error);
        errors.push({ msg: "An error occurred during authentication" });
        return handleErrors(req, res, errors, '/login');
    }
});

router.get('/logout', isLoggedIn ,(req, res, next) => {
    // Clear the cookie that stores the token
    res.clearCookie('token');
    // Redirect to the login page or home page
    res.redirect('/login');
});

/*
const hashedPassword = hashPassword("123456"); // Ensure hashPassword is a function that returns a hashed password
const user = new UserModel({ username: "zengo", password: hashedPassword });

user.save()
  .then(res => console.log(res))
  .catch(err => console.log("Error occurred:", err)); // Including error details in the console

*/

module.exports = router;
