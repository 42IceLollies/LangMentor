const pg = require("pg");
const Pool = pg.Pool;
require('dotenv').config();

const { POSTGRES_USER, POSTGRES_PASS, DATABASE } = process.env;

const pool = new Pool({
	host: "localhost",
	port: 5432,
	user: POSTGRES_USER,
	password: POSTGRES_PASS,
	database: DATABASE
});

module.exports = pool;

