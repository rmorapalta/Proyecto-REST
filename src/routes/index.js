const express = require('express');
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
	// Show page
	res.sendFile(path.join(__dirname, '../views/index.html'));
})

// router.get("/v1/callback/verify")

module.exports = router;
