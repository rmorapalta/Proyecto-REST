const jwtDecode = require('jwt-decode');

//verificacion de token
const authentication = (req, res, next) => {
	const token = req.headers['jwt'];

	// Si no se encuentra el jwt
	if(!token) {
		return res.json({ error: 'No se encuentra el jwt' });
	}

	let payload = {};

	try {
		payload = jwtDecode(token);
	} catch(err) {
		return res.json({ error: 'El token es incorrecto' });
	}
	//validacion de tiempo 
	var timestamp = new Date().toISOString();
	if(payload.expiredAt < timestamp) {
		return res.json({ error: 'Token expirado' });
	}

	req.usuarioId = payload.usuarioId;
	next();
}


module.exports = {
    authentication
}
