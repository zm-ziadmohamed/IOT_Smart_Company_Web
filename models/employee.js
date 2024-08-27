const mongoose = require('mongoose');
const employeeModel = mongoose.model('employee', mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    phone: {
        required: true,
        type: String,
        unique: true
    },
    secret: {
        required: true,
        type: String,
        unique: true
    },
}))

/*
// Function to add multiple employees
async function addEmployees(employees) {
    try {
        // Insert multiple employee documents into the database
        const result = await employeeModel.insertMany(employees);
        console.log('Employees added successfully:', result);
    } catch (error) {
        console.error('Error adding employees:', error.message);
    }
}

// Example usage
const employeeData = [
    { name: 'John Doe', phone: '123-456-7890', secret: 'mySecret123' },
    { name: 'Jane Smith', phone: '098-765-4321', secret: 'anotherSecret456' },
    { name: 'Alice Johnson', phone: '555-555-5555', secret: 'secret789' }
];
addEmployees(employeeData);
*/

module.exports = employeeModel