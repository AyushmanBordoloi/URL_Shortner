const express = require('express');
const router = express.Router();

const { shortenUrl } = require('../controllers/url');

router.post('/', shortenUrl);

module.exports = router;