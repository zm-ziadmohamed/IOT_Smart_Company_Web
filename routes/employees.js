const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isLoggedIn } = require('../security')
const employeeModel = require('../models/employee')

// Route to get all employees
router.get('/employees', isLoggedIn, async (req, res, next) => {
    try {
        // Fetch all employees from the database
        const employees = await employeeModel.find({});
        
        // Render the 'employees' view and pass the employees data to it
        res.render('employees', { employees });
    } catch (error) {
        console.error('Error fetching employees:', error.message);
        next(error); // Pass the error to the error handler middleware
    }
});

// Route to show the form for adding a new employee
router.get('/add-employee', isLoggedIn, (req, res) => {
    const errors = req.flash('errors');
    res.render('add-employee', { errors});
});

// Route to handle form submission and employee creation
router.post('/add-employee', isLoggedIn, [
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
    check('phone').notEmpty().withMessage('Phone number is required').trim().escape().isMobilePhone().withMessage('Invalid phone number'),
    check('secret').notEmpty().withMessage('Secret is required').trim().escape().isLength({ min: 6 }).withMessage('Secret must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        req.flash('errors',errors)
        return res.redirect('/add-employee')
    }

    try {
        const newEmployee = new employeeModel({
            name: req.body.name,
            phone: req.body.phone,
            secret: req.body.secret
        });
        await newEmployee.save();
        res.redirect('/employees'); // Redirect to the employee list page after successful creation
    } catch (error) {
        errors.push({ msg: "An error occurred during authentication" });
        req.flash('errors',errors)
        res.redirect('/add-employees')

    }
});





module.exports = router