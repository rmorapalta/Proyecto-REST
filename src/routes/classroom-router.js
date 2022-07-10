const express = require('express');
const router = express.Router();
const path = require('path');

// /v1/classroom/
router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, '../views/classroom.html'));
})


// /v1/classroom/getout
router.post("/getout", (req, res) => {
	res.send('/getout/');
})


// /v1/classroom/getin
router.post("/getin", (req, res) => {
	res.send('/getin/');
})


// /v1/classroom/attendances
router.post("/attendances", (req, res) => {
	res.send('/attendances/');
})


module.exports = router;
