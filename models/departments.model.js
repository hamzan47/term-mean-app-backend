/* eslint-disable no-undef */

/**
 * Department Schema for Complaint Center.
 * 
 */

 const mongoose = require('mongoose')

 const departments = new mongoose.Schema({
 
     departmentName: {type: String, required: true},
     departmentHead: {
         name: {type: String, required: true,},
        email: {type: String, required: true, unique: true, default: "admin@complaint.com"},
        contact: {type: Integer, required: true, default: 0}
     },
     complaintsClosed: { type: Integer, required: false, default: 0},
     complaintsPending: {type: Integer, required: false, default: 0},
     subDepartments: { type: String, required: false, default:""}
 
     },{ collection: 'departments'})
 
     const model = mongoose.model('departments',departments);
 module.exports = model 