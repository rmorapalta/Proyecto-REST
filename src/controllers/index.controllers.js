const { pool } = require('./database.controllers');

async function initDatabase(){
	try {
		var queryStudent = 'SELECT exists(SELECT 1 FROM student WHERE nombre=$1)'
		var insertStudent = 'INSERT INTO student(email,nombre) VALUES($1,$2)'

		var resp1 = await pool.query(queryStudent,['Sebastian'])
		var resp2 = await pool.query(queryStudent,['Rodrigo'])
		var resp3 = await pool.query('SELECT exists(SELECT 1 FROM section WHERE nombre=$1)',['INFB8090'])
		var resp4 = await pool.query('SELECT exists(SELECT 1 FROM grade WHERE id_section=$1 AND id_student=$2)',[1,1])

		if(resp1['rows'][0]['exists'] === false){
			await pool.query(insertStudent ,['ssalazar@utem.cl','Sebastian'])
		}
		if(resp2['rows'][0]['exists'] === false){
			await pool.query(insertStudent ,['rmora@utem.cl','Rodrigo'])
		}
		if(resp3['rows'][0]['exists'] === false){
			await pool.query('INSERT INTO section(nombre) VALUES($1)',['INFB8090'])
		}
		if(resp4['rows'][0]['exists'] === false){
			await pool.query('INSERT INTO grade(id_section,id_student) VALUES($1,$2)',[1,1])
		}
	} catch (error) {
		console.log('[ERROR] Error en la creacion de la base de datos: ',error);
	}
};

module.exports = {
	initDatabase
};
