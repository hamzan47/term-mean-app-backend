const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const User = new mongoose.Schema(
	{
		name: {type: String, required: true, default: "default-name"},
		email: {type: String, required: true, unique: true, default: "admin@complaint.com"},
		password: {type: String, required: true, default: "11221122"},
		userType: {type: String, required: true, default: ""},
		userDepartment: {type: String, required: true, default: ""}
	},
	{ collection: 'user-data' }
)

const model = mongoose.model('UserData', User)
module.exports = model