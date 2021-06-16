const express = require("express");
const authRouter = express.Router();
const utils = require("../utils/auth.util.js");
const encodeUtils = require("../utils/encoding.util.js");
const pool = require("../databaseSetup.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../emailSetup.js");

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
				const accessToken = jwt.sign({ username, email, pass: hashed }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
				const refreshToken = jwt.sign({ username, email }, process.env.REFRESH_TOKEN_SECRET);

				sendVerificationEmail(email, username, hashed, (response) => {
					if (response) res.json({ status: 200, accessToken, refreshToken });
					else res.json({ status: 500, message: "Sorry, something went wrong sending the verificaiton email..." });
				});
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
					const accessToken = jwt.sign({ username, email, pass: userExists.user_pass }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
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

authRouter.get('/verify/:_name/:_email/:_pass', async (req, res) => {
    const { _name, _email, _pass } = req.params;
    const [ username, email, password ] = encodeUtils.decodeStrings([ _name, _email, _pass ]);
    
    const userExists = await utils.unverifiedAndExists(pool, username, email);
    if (userExists) {
        if (password === userExists.user_pass) {
            try {
                const { user_name, user_email, user_pass } = userExists;
                await pool.query("INSERT INTO users (user_name, user_email, user_pass) VALUES ($1, $2, $3)", [ user_name, user_email, user_pass ]);
                await pool.query("DELETE FROM unverified_users WHERE user_name = $1 AND user_email = $2 AND user_pass = $3", [ user_name, user_email, user_pass ]);
                res.json({ status: 200 });
            } catch (err) {
                console.log(err);
                res.json({ status: 500, message: "Sorry... Something went wrong" });
            }
        } else res.json({ status: 403, message: "Invalid password in verification link" });
    } else res.json({ status: 400, message: "Invalid verification link" });
});

module.exports = authRouter;
