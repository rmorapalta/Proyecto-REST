const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');
const path = require('path');
const { pool } = require('../controllers/database.controllers');
const { authentication } = require('../middleware/auth');


router.get("/", (_, res) => {
	//res.sendFile(path.join(__dirname, '../views/index.html'));
	res.status(200).send('Server running..');
})


/**
 * @swagger
 * /login:
 *   get:
 *     tags: [authentication-rest]
 *     summary: Send request to token request
 *     operationid: login
 *     responses:
 *       200:
 *         description: get the token, sign and URL to login
 *       400:
 *         description: Error in the token response
 */
router.get("/login", (_, res) => {
	try {
		var config = {
			method: 'post',
			url: 'https://api.sebastian.cl/UtemAuth/v1/tokens/request',
			headers: { // TOKEN y KEY propias del grupo E
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
});
router.get("/success", (_, res) => {
	res.sendFile(path.join(__dirname, '../views/success.html'));
})
router.get("/failed", (_, res) => {
	res.sendFile(path.join(__dirname, '../views/failed.html'));
})


/**
 * @swagger
 * /attendances:
 *   get:
 *     description: Check attendances information
 *     responses:
 *       200:
 *         description: Send attendance information
 *       400:
 *         description: Attendances not found
 */
router.get("/attendances", authentication, async (_, res) => {
	try {
		var asistencias = await pool.query('SELECT * FROM attendance WHERE entrada IS NOT NULL AND salida IS NOT NULL');
		res.status(200).json(asistencias.rows);
	} catch (error) {
		res.status(400).json(error);
	}
})


/**
 * @swagger
 * /getin:
 *   post:
 *     tags: [classroom-rest]
 *     description: Check attendances information
 *     operationid: Getin
 *     parameters:
 *       name: Authorization
 *       in: header
 *       required: true
 *     requestBody:
 *       content:
 *         aplication/json:
 *           classroom
 *           entrance
 *           subject
 *     responses:
 *       200:
 *         description: Insert attendance data
 *       400:
 *         description: Error in the attendance query
 */
router.post("/getin", authentication, async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			// Payload carga con el jwt ya codificado
			payload = jwtDecode(userToken);
			// Se saca el dato del estudiante de la base de datos
			var queryStudent = await pool.query('SELECT * FROM student WHERE email=$1',[payload.email]);
			if (queryStudent['rows'].length > 0) {
				// Si encuentra al estudiante, se saca datos proveniente de la seccion
				var querySection = await pool.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySection['rows'].length > 0) {
					// Comprobar si existe la seccion
					var queryGrade = await pool.query('SELECT * FROM grade WHERE id_section=$1 AND id_student=$2',[querySection['rows'][0]['id'],queryStudent['rows'][0]['id']]);
					if (queryGrade['rows'].length > 0) {
						// Insertar datos a asistencia
						await pool.query('INSERT INTO attendance(email,sala,section,entrada) VALUES($1,$2,$3,$4)',[payload.email,req.body.classroom,req.body.subject,req.body.entrance]);
						res.status(200).json({ //insertar datos
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


/**
 * @swagger
 * /getin:
 *   post:
 *     tags: [classroom-rest]
 *     description: Classroom get out information
 *     operationid: GetOut
 *     parameters:
 *       name: Authorization
 *       in: header
 *       required: true
 *     requestBody:
 *       content:
 *         aplication/json:
 *           classroom
 *           entrance
 *           leaving
 *           subject
 *     responses:
 *       200:
 *         description: Send attendance information
 *       400:
 *         description: Attendances not found
 */
router.post("/getout", authentication, async (req, res) => {
	try {
		if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
			const userToken = req.headers['jwt'];
			let payload = {};
			// Payload carga con el jwt ya codificado
			payload = jwtDecode(userToken);
			// Se saca el dato del estudiante de la base de datos
			var queryStudent = await pool.query('SELECT * FROM student WHERE email=$1',[payload.email]);
			if (queryStudent['rows'].length > 0) {
				// Si encuentra al estudiante, se saca datos proveniente de la seccion
				var querySection = await pool.query('SELECT * FROM section WHERE nombre=$1',[req.body.subject]);
				if (querySection['rows'].length > 0) {
					// Comprobar si existe la seccion
					var queryGrade = await pool.query('SELECT * FROM grade WHERE id_student=$1 AND id_section=$2',[queryStudent['rows'][0]['id'],querySection['rows'][0]['id']]);
					if (queryGrade['rows'].length > 0) {
						// Seleccionar datos desde asistencia, de entrada y seccion y sala
						var queryEntrance = await pool.query('SELECT * FROM attendance WHERE email=$1 AND entrada=$2 AND section=$3 AND sala=$4',[payload.email,req.body.entrance,req.body.subject,req.body.classroom]);
						if (queryEntrance['rows'].length > 0) {
							// Se hace un update  a la base de datos, donde se ingresa salida
							await pool.query('UPDATE attendance SET salida=$1 WHERE id=$2',[req.body.leaving,queryEntrance['rows'][0]['id']]);
							res.status(200).json({ //insertar datos
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
});


module.exports = router;
