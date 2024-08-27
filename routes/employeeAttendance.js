const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isLoggedIn } = require('../security')
const employeeAttendanceModel = require('../models/attendance');

// Route to display attendance with employee data
router.get('/attendance', isLoggedIn, async (req, res, next) => {
    try {
        // Fetch all attendance records with associated employee data
        const attendanceRecords = await employeeAttendanceModel.aggregate([
            {
                $lookup: {
                    from: "employees", // Collection name in MongoDB
                    localField: "secret",
                    foreignField: "secret",
                    as: "employeeData"
                }
            },
            {
                $unwind: "$employeeData"
            }
        ]);

        res.render('attendance', { attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance records:', error.message);
        next(error); // Pass the error to the error handler middleware
    }
});





module.exports = router