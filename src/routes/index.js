const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');
const { pool } = require('../controllers/database.controllers')
// timestamp = new Date().toISOString();


router.get("/", (_, res) => {
	//res.sendFile(path.join(__dirname, '../views/index.html'));
	res.send("Server running..");
})


// Ingreso
router.get("/login", (_, res) => {
	try {
		var config = {
			method: 'post',
			url: 'https://api.sebastian.cl/UtemAuth/v1/tokens/request',
			headers: {
				'X-API-TOKEN': 'CPYD-E-202201',
				'X-API-KEY': 'e45e7ae59d1c4df3aaa2482cbb38434b',
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				"successUrl": `http://localhost:3000/grupo-E/success`,
				"failedUrl": `http://localhost:3000/grupo-E/failed`
			})
		};
		axios(config)
		.then(function (response) {
			res.status(200).json(response.data);
		})
		.catch(function (error) {
			res.status(400).json(error);
		});
	} catch (error) {
		res.status(400).json(error);
	}
})


// Chequear asistencias
router.get("/attendance", async (_, res) => {
	try {
		var asistencias = await pool.query('SELECT * FROM attendance WHERE entrada IS NOT NULL AND salida IS NOT NULL');
		res.status(200).json(asistencias.rows);
	} catch (error) {
		res.status(400).json(error);
	}
})


// Ingresar asistencia
router.post("/getin", async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			payload = jwtDecode(userToken);
			var queryStudent = await pool.query('SELECT * FROM student WHERE email=$1',[payload.email])
			if (queryStudent['rows'].length > 0) {
				var querySection = await pool.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySection['rows'].length > 0) {
					var queryGrade = await pool.query('SELECT * FROM grade WHERE id_student=$1 AND id_section=$2',[queryStudent['rows'][0]['id'],querySection['rows'][0]['id']])
					if (queryGrade['rows'].length > 0) {
						await pool.query('INSERT INTO attendance(email,sala,section,entrada) VALUES($1,$2,$3,$4)',[payload.email,req.body.classroom,req.body.subject,req.body.entrance]);
						res.status(200).json({
							"classroom" : req.body.classroom,
							"subject" : req.body.subject,
							"entrance" : req.body.entrance,
							"email" : payload.email
						});
					} else {
				res.status(400).json('[ERROR] El estudiante no pertence a esta seccion');
					}
				} else {
					res.status(400).json('[ERROR] No existe la seccion');
				}
			} else {
				res.status(400).json('[ERROR] No existe el estudiante');
			}
		} else {
			res.status(400).json('[ERROR] Parametros incorrectos');
		}
	} catch (error) {
		res.status(400).json(error);
	}
});


// Salida
router.post("/getout", async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			payload = jwtDecode(userToken);
			var queryStudent = await pool.query('SELECT * FROM student WHERE email=$1',[payload.email])
			if (queryStudent['rows'].length > 0) {
				var querySection = await pool.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySection['rows'].length > 0) {
					var queryGrade = await pool.query('SELECT * FROM grade WHERE id_student=$1 AND id_section=$2',[queryStudent['rows'][0]['id'],querySection['rows'][0]['id']])
					if (queryGrade['rows'].length > 0) {
						var queryEntrance = await pool.query('SELECT * FROM attendance WHERE email=$1 AND entrada=$2 AND section=$3 AND sala=$4',[payload.email,req.body.entrance,req.body.subject,req.body.classroom]);
						if (queryEntrance['rows'].length > 0) {
							await pool.query('UPDATE attendance SET salida=$1 WHERE id=$2',[req.body.leaving,queryEntrance['rows'][0]['id']]);
							res.status(200).json({
								"classroom" : req.body.classroom,
								"subject" : req.body.subject,
								"entrance" : req.body.entrance,
								"leaving" : req.body.leaving
							});
						} else {
							res.status(400).json('[ERROR] El ingreso a la sala no fue en la fecha indicada');
						}
					} else {
						res.status(400).json('[ERROR] El estudiante referido no existe en esta seccion');
					}
				} else {
					res.status(400).json('[ERROR] La seccion no existe');
				}
			} else {
				res.status(400).json('[ERROR] El estudiante no existe ');
			}
		} else {
			res.status(400).json('[ERROR] Parametros incorrectos');
		}
	} catch (error) {
		res.status(400).json(error);
	}
})


module.exports = router;
