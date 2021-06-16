const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const utils = require("./utils/auth.util.js");
const pool = require("./databaseSetup.js");

// other setup
require("dotenv").config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
	if (req.headers['authorization']) {
		const token = req.headers['authorization'].replace(/Bearer /gm, '');
		if (token && token.split('.').length === 3) {
			try {
				const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
				const userExists = await utils.userExists(pool, data.username, data.email);

				if (userExists)
					next();
		   	} catch (err) {
				const rtExists = await utils.refreshTokenValid(pool, req.body.refreshToken.replace(/Bearer /, ''));
				if (req.body.refreshToken && req.body.refreshToken.split('.').length === 3 && rtExists) {
					const refreshToken = req.body.refreshToken.replace(/Bearer /, '');
					try {	
						const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
						const user = await utils.userAndExists(pool, data.username, data.email);
							
						if (user) {
							const { user_name: username, email, pass } = user;
							const accessToken = jwt.sign({ username, email, pass }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
							const newRefreshToken = jwt.sign({ username, email }, process.env.REFRESH_TOKEN_SECRET);
	
							await pool.query("INSERT INTO banished_rts (_rt) VALUES ($1)", [ refreshToken ]);
							req.headers['authorization'] = accessToken;
							req.body.refreshToken = newRefreshToken;
							next();
						} else res.json({ status: 600, message: "Invalid refresh token" });
					} catch (err) {
						res.json({ status: 600, message: "Invalid refresh token" });
						console.log(err);
					} 
				} else res.json({ status: 600, message: "Invalid refresh token" });
			}
		} else res.json({ status: 600, message: "Invalid access token" });
	} else next();
});

// ReST API
app.use('/auth', require("./routes/auth.route.js"));

// main API
app.get('/', (req, res) => {
	res.json({ status: 200, message: "Welcome to the LangMentor ReST API" });
});

app.post('/topsecret', async (req, res) => {
	const user = jwt.verify(req.headers['authorization'].replace(/Bearer /gm, ''), process.env.ACCESS_TOKEN_SECRET);

	res.json({ status: 200, message: `this is some top secret stuff @${user.username}` });
});

// start server
app.listen(process.env.PORT || 8000, () => console.log('Server running...'));
