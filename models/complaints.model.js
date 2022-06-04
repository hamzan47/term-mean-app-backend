const mongoose = require('mongoose')

const complaints = new mongoose.Schema({
    complaintByUserEmail: {type: String, required: true, default: "email"},
    complaintDepartment: {type: String, required: true, default: "departmentName"},
    complaintSubDepartment: {type: String, required: true, default: "subDepartmentName"},
    complaintDate: {type: Date, required: true},
    complaintDetails: {type: String, required: true, default: "complaint Details here."},
    complaintStatus: {
        type: String,
        enum: ['InProgress', 'Pending', 'Closed'],
        default: 'InProgress'
    },
    complaintOutcome: {
        type: String, 
        enum: ['relief granted','relief not granted','partial relief granted'],
        default: 'relief not granted',
    },
    complaintAssignee: {
        name: {type: String, required: true},
        email: {type: String, required: true, default: "email@complaint.com"},
        contact: {type: Integer, required: true, default: "00000000000"},
    }

    },{ collection: 'complaints'})

    const model = mongoose.model('complaints',complaints);

module.exports = model