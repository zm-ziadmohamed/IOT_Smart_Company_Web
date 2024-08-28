const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isLoggedIn } = require('../security')
const { publishLightControl } = require('../MQTT/mqttConnect');

// Route to display the form
router.get('/light-control', isLoggedIn, (req, res) => {
    const errors = req.flash('errors');
    res.render('lightControl', { errors });
});

// Route to handle form submission
router.post('/light-control', isLoggedIn, [
    check('color').isIn(['red', 'green', 'white', 'yellow']).withMessage('Invalid color'),
    check('mode').isIn(['High', 'Low', 'Medium', 'Off', 'Auto']).withMessage('Invalid mode')
], (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        req.flash('errors',errors)
        return res.redirect('/light-control')
    }

    const { color, mode } = req.body;

    // Call the publishLightControl function with the selected color and mode
    publishLightControl(color, mode)
        .then(() => {
            res.redirect('/light-control');
        })
        .catch(err => {
            errors.push({ msg : 'Error publishing light control'})
            req.flash('errors',errors)
            return res.redirect('/light-control')
        });
});

module.exports = router;