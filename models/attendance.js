const mongoose = require('mongoose');
const employeeAttendanceModel = mongoose.model('employeeAttendance', mongoose.Schema({
    secret : {
        required: true,
        type: String,
    },
    date : {
      default : Date.now(),
      type : Date
    }
}))



module.exports = employeeAttendanceModel;