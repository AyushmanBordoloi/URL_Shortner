const express = require('express');
const router = express.Router();

const { shortenUrl } = require('../controllers/url');

router.post('/shortUrl', shortenUrl);

module.exports = router;