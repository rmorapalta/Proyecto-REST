const { Pool } = require('pg');

const pool = new Pool({
	host: "localhost",
	user: "postgres",
	password: "carla",
	database: "estudiantes",
	port: '5432'
});

const getName = async (req, res) => {
	const querys = await pool.query('SELECT * FROM users');
	res.status(200).json(querys.rows);
};

module.exports = {
	getName
};
