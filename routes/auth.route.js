const express = require("express");
const authRouter = express.Router();

authRouter.get('/', (req, res) => {
	res.json({ status: 200, message: "Welcome to the auth ReST API for LangMentor" });
});

module.exports = authRouter;
