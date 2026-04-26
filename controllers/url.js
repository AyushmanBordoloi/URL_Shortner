const { nanoid } = require('nanoid');
const pool = require('../db');

// ShortURL
async function shortenUrl(req, res) {
    const body = req.body;
    if(!body.shortenUrl){
        return res.status(400).json({error: 'Invalid URL'});
    }
    const shortID = nanoid(8);
    const result = await pool.query(
        'insert into urls (original_url, short_url) values ($1, $2) returning *', [body, shortID]
    );
    const row = result.rows[0];
    res.status(201).json({
        short_url: `${process.env.BASE_URL}/${row.short_url}`,
        code: row.short_url,
    });
};

module.exports = {
    shortenUrl
};