const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jwt-simple');
const jwtDecode = require('jwt-decode');
const { pool } = require('../controllers/index.controllers')

//const { getName } = require('../controllers/index.controllers')

// timestamp = new Date().toISOString();

router.get("/", (req, res) => {
	// Show page
	//res.sendFile(path.join(__dirname, '../views/index.html'));
	res.send("Server running..");
})


// Ingreso
router.get("/login", (req, res) => {
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
router.get("/attendance", async (req, res) => {
	try {
		var asistencias = await pool.query('SELECT * FROM attendance WHERE entrada IS NOT NULL AND salida IS NOT NULL');
		res.status(200).json(asistencias.rows);
	} catch (error) {
		res.status(400).json(error);
	}
})


// Ingresar asistencia
router.get("/getin", async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			payload = jwtDecode(userToken);
			var queryEstudiante = await db.query('SELECT * FROM student WHERE email=$1',[payload.email])
			if (queryEstudiante['rows'].length > 0) {
				var querySeccion = await db.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySeccion['rows'].length > 0) {
					var queryCurso = await db.query('SELECT * FROM grade WHERE id_estudiante=$1 AND id_seccion=$2',[queryEstudiante['rows'][0]['id'],querySeccion['rows'][0]['id']])
					if (queryCurso['rows'].length > 0) {
						await db.query('INSERT INTO attendance(email,sala,seccion,entrada) VALUES($1,$2,$3,$4)',[payload.email,req.body.classroom,req.body.subject,req.body.entrance]);
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


// Ingresar salida
router.get("/getout", async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			payload = jwtDecode(userToken);
			var queryEstudiante = await db.query('SELECT * FROM student WHERE email=$1',[payload.email])
			if (queryEstudiante['rows'].length > 0) {
				var querySeccion = await db.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySeccion['rows'].length > 0) {
					var queryCurso = await db.query('SELECT * FROM grade WHERE id_estudiante=$1 AND id_seccion=$2',[queryEstudiante['rows'][0]['id'],querySeccion['rows'][0]['id']])
					if (queryCurso['rows'].length > 0) {
						var queryEntrada = await db.query('SELECT * FROM attendance WHERE email=$1 AND entrada=$2 AND seccion=$3 AND sala=$4',[payload.email,req.body.entrance,req.body.subject,req.body.classroom]);
						if (queryEntrada['rows'].length > 0) {
							await db.query('UPDATE attendance SET salida=$1 WHERE id=$2',[req.body.leaving,queryEntrada['rows'][0]['id']]);
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
