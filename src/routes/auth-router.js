const express = require('express');
const router = express.Router();
const path = require('path');


router.get("/", (req, res) => {
	res.send('En authentication!!')
})


// Esto no va x.x
router.get("/login", (req, res) => {
	token = "este deberia ser el login";
	sign = "Esta deberia ser la firma";
	timestamp = new Date().toISOString();

	// Respuesta
	res.send({
		"token": token,
		"sign": sign,
		"redirectURL": "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&state=a0lPlcHUvxU06wYmVcthjgUdvw07DW8OYJtvG&redirect_uri=https%3A%2F%2Fapi.sebastian.cl%2FUtemAuth%2Fv1%2Fcallback%2Fverify&client_id=384118605660-v7auj7u3o2dgan0evv37ovr6ev3cgldd.apps.googleusercontent.com",
		"created": timestamp,
	})
})


module.exports = router;
