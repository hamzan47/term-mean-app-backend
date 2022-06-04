const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Complaint = require("./models/complaints.model");
const Departments = require("./models/departments.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config()

app.use(cors());
app.use(express.json());

// parse request of content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/azcon-construction-portfolio");
mongoose.connect(process.env.DB_URI);

// simple route
app.get("/", (req, res) => {
	console.log(res);
	res.jsonp({ message: "Welcome to complaint center." });
});

// Start: User routes and authentication
app.post("/api/register", async (req, res) => {
	if(req.body.name == null || req.body.email == null || req.body.password == null)
		if(req.body.name == null)
			return res.status(400).json({ message: "Name is required" });
		else if(req.body.email == null)
			return res.status(400).json({ message: "Email is required" });
		else if(req.body.password == null)
			return res.status(400).json({ message: "Password is required" });
	
	try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
			userType: req.body.userType,
			userDepartment: req.body.userDepartment
		});
		return res.status(200).json({ status: "Ok", message: "User Registered Successfully. " });
	} catch (err) {
        return (err.errors) ? res.status(500).jsonp({status: "error", error: err.errors}) : res.status(208).jsonp({status: "error","message": "Duplicate Entry"});
	}
});
app.post("/api/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
	if (!user) 
		return { status: 'error', error: 'Invalid login' }

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign({
				name: user.name,
				email: user.email,
			}, 'secret123');
		return res.json({ message: "user found" , status: 'ok', user: token })
	} 
    return res.json({ status: 'error', user: false })
});
// End: User routes and authentication


// Start: Complaints with Departments
app.get('/api/complaints', async(req,res) => {
	const filter = {};
	const complaints = await Complaint.find(filter);

	if(complaints.length == 0)
		return res.status(404).json({ message: "No complaints found." });
	
	return res.status(200).json({ status: "Ok", complaints: complaints });
});

app.post('/api/complaints', async(req,res) => {
	const token = req.headers['x-access-token'];
	if(!token)
		return res.status(401).jsonp({status: "Unauthorized route. You've to login first.", error: 401});
	
	const complaint = await Complaint.create(req.body);
	return res.status(200).json({status: 'ok', complaint: complaint});
})

app.get('/api/complaint/:id', async(req,res)=> {
	const filter = { _id: req.params.id };
	const complaint = await Complaint.findOne(filter);
	if(!complaint)
		return res.status(404).json({ message: "No complaint found." });
	return res.status(200).json({ status: "Ok", complaint: complaint });
})

app.put('/api/complaint/:id', async(req,res)=>{
	const filter = { _id: req.params.id };
	if(!complaint)
		return res.status(404).json({ message: "No complaint found." });

	const complaint = await Complaint.findOneAndUpdate({_id: req.params.id},req.body);
	if(complaint)
		return res.status(200).json({ status: "Ok", complaint: complaint });
	return res.status(404).json({ message: "No complaint found." });
})

app.delete('/api/complaint/:id', async(req,res)=>{
	const token = req.headers['x-access-token'];
	if(!token)
		return res.status(401).jsonp({status: 'Unauthorized route. You have to login first.', error: 401});
	const complaint = await Complaint.findOneAndDelete({_id: req.params.id});
	if(complaint)
		return res.status(200).json({ status: "Ok", complaint: complaint });
	return res.status(404).json({ message: "No complaint found." });
})
// End: Complaints With Departments

// Start: Departments

// End: Departments

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});