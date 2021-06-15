const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// other setup
require("dotenv").config();
const app = express();

// middleware
app.use(cors());
app.use(express.static('public'));

// ReST API
app.use('/auth', require("./routes/auth.route.js"));

// main API
app.get('/', (req, res) => {
	res.json({ status: 200, message: "Welcome to the LangMentor ReST API" });
});

// start server
app.listen(process.env.PORT || 8000, () => console.log('Server running...'));
