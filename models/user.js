const mongoose = require('mongoose');
const userModel = mongoose.model('user', mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
}))



//userModel.deleteMany().then(res => console.log(res))
module.exports = userModel