const nodemailer = require("nodemailer");

const { 
	EMAIL_SERVICE: service,
	EMAIL_BOT_PASS: password, 
	EMAIL_BOT_EMAIL: email 
} = process.env;

const transporter = nodemailer.createTransport({
	service,
	auth: {
		user: email,
		pass: password
	} 
});

const sendVerificationEmail = (toEmail, username, responseHandler) => {
	let success = false;
	transporter.sendMail({
		from: email,
		to: toEmail,
		subject: "One more step to setting up your account!",
		html: `
			<div id=${Math.pow(Date.now(), Date.now())} style="text-align: center; width: 100%;">
				<h1>Hey ${username}, there's just one last thing you have to do to start using your LangMentor account!</h1>
				<h3>To successfully register your account, you have to verify your email. Just click the button below to verify your email!</h3>
				<a target="_blank" href="http://localhost:8000/verify/">
					<img src="data:image/png;base64,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" alt="Verify My Email!" />
				</a>
				<h3>Once you're done with this, you can take advantage of your LangMentor account.</h3>
				<h3>You can...</h3>
				<ul style="text-align: center; width: 100%;">
					<strong>You can learn lots of languages</strong>
					<br/>
					<strong>Recieve notifications</strong>
					<br/>
					<strong>Learn without seeing ads</strong>
					<br/>
					<strong>Ask questions in the forums</strong>
					<br/>
					<strong>Get access to ranks and the leaderboards</strong>
					<br/>
					<strong>Give feedback on upcoming updates and features</strong>
				</ul>
				<h4>...And more!</h4>
			</div>
		`
	}, (err, res) => {
		if (!err && res.response) responseHandler(true);
		else responseHandler(false);
	});
}

module.exports = {
	sendVerificationEmail
};