const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { isLoggedIn } = require('../security')
const employeeAttendanceModel = require('../models/attendance');
const employeeModel = require('../models/employee')
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
router.post('/checkSecret',(req,res,next)=>{
     employeeModel.findOne({secret : req.body.secret}).then(user => {
        console.log(req.body)
        if (user) {
            res.json({msg : "correct"})
        } else {
            res.json({msg : "inncorrect"})
        }
     }).catch("error occured")
})
router.post('/recordAttendance',(req,res,next)=>{
    (new employeeAttendanceModel({secret : req.body.secret})).save().then(employeeAttendance => {
        res.json({msg : "done"})
    }).catch(err => {
        res.send({msg : "error occurred"})
    })
})



module.exports = router