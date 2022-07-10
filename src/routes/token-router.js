const express = require('express');
const router = express.Router();
const path = require('path');


// /v1/tokens/
router.get("/", (req, res) => {
	res.send('En token!!')
})


// /v1/tokens/request
router.get("/request", (req, res) => {
	res.send('Se deberia mostrar la request del token!!');
})


// /v1/tokens/<token>/jwt
router.get("/:token/jwt", (req, res) => {
	res.send('Se deberia mostrar el token!!')
})


module.exports = router;
