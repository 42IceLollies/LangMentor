const bcrypt = require("bcryptjs");

const validateFields = ([ ...fields ]) => {
	let steps = [false, false];
	steps[0] = !fields.map(field => (field && field !== "") ? true : false)
		.includes(false);
	steps[1] = !fields.map(field => field.search(/(SELECT( ?\* ?| (.)* )FROM (.)*((( )+)?;|(GROUP BY|WHERE|ORDER BY) (.)*))|(DROP (TABLE|DATABASE) (.)*((( )+)?\;?|WHERE (.)*))/ig) === 0 ? true : false)
		.includes(true);
	return !steps.includes(false);
}

const emailValid = (email) =>
	email.search(/[a-zA-Z](.)*@(.)*(\.(co[m]?|net|org|gov|edu|cf|ga|tk|ml))*/g) === 0 ? true : false;

const userExistsBoth = async (pool, username, email) => {
	const userExists = await pool.query("SELECT user_id FROM users WHERE user_name = $1 AND user_email = $2", [ username, email ]);
	const unverifiedExists = await pool.query("SELECT user_id FROM unverified_users WHERE user_name = $1 AND user_email = $2", [ username, email ]);
		
	return (userExists.rows.length !== 0 || unverifiedExists.rows.length !== 0);
}

const userExists = async (pool, username, email) => {
	const userExists = await pool.query("SELECT user_id FROM users WHERE user_name = $1 AND user_email = $2", [ username, email ]);

	return (userExists.rows.length !== 0);
}

const userAndExists = async (pool, username, email) => {
	const userExists = await pool.query("SELECT * FROM users WHERE user_name = $1 AND user_email = $2", [ username, email ]);

	return userExists.rows.length !== 0 ? userExists.rows[0] : false;
}

module.exports = {
	validateFields,
	emailValid,
	userExistsBoth,
	userExists,
	userAndExists
};
