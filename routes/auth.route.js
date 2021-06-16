const express = require("express");
const authRouter = express.Router();
const utils = require("../utils/auth.util.js");
const pool = require("../databaseSetup.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

authRouter.get('/', (req, res) => {
	res.json({ status: 200, message: "Welcome to the auth ReST API for LangMentor" });
});

authRouter.post('/register', async (req, res) => {
	const { username, email, password } = req.body;

	if (utils.validateFields([ username, email, password ]) && utils.emailValid(email)) {
		const userExists = await utils.userExistsBoth(pool, username, email);
		if (userExists) {
			res.json({ status: 409, message: "That user already exists. Please register with a different username or email" });
		} else {
			try {
				const hashed = await bcrypt.hash(password, 10);
				await pool.query("INSERT INTO unverified_users (user_name, user_email, user_pass) VALUES ($1, $2, $3)",  [ username, email, hashed ]);
				const accessToken = jwt.sign({ username, email, pass: hashed }, process.env.ACCESS_TOKEN_SECRET);
				const refreshToken = jwt.sign({ username, email }, process.env.REFRESH_TOKEN_SECRET);

				res.json({ status: 200, accessToken, refreshToken });
			} catch (err) {
				console.log(err);
				res.json({ status: 500, message: "Sorry, something went wrong... Please try again" });
			}
		}
	} else res.json({ status: 400, message: "Please enter a valid username, email, and password" });
});

authRouter.post('/login', async (req, res) => {
	const { username, email, password } = req.body;
	
	if (utils.validateFields([ username, email, password ]) && utils.emailValid(email)) {
		const userExists = await utils.userAndExists(pool, username, email);
		if (userExists) {
			try {
				const validPass = await bcrypt.compare(password, userExists.user_pass);
				if (validPass) {
					const accessToken = jwt.sign({ username, email, pass: userExists.user_pass }, process.env.ACCESS_TOKEN_SECRET);
					const refreshToken = jwt.sign({ username, email }, process.env.REFRESH_TOKEN_SECRET);

					res.json({ status: 200, accessToken, refreshToken });
				} else res.json({ status: 403, message: "Incorrect password" });
			} catch (err) {
				console.log(err);
				res.json({ status: 403, message: "Invalid password" });
			}
		} else res.json({ status: 400, message: "Invalid username, email, or password" });
	} else res.json({ status: 400, message: "Please enter a valid username, email, and password" });
});

module.exports = authRouter;