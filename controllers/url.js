const { nanoid } = require('nanoid');
const pool = require('../db');

// ShortURL
const shortenUrl = async (req, res)=> {
    const url = req.body.url;
    if(!url){
        return res.status(400).json({error: 'URL is required'});
    }
    const shortID = nanoid(7);
    try{
        const result = await pool.query("insert into short_url(url, short_url) values ($1, $2) returning *", [url, shortID]);
        const shortUrl = `http://localhost:3000/${result.rows[0].short_url}`;
        res.json({shortUrl});

    }catch (error){
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }

};

const redirectToOriginalURL = async (req, res) => {
    const { code } = req.params;

    try {
        const result = await pool.query(
            "select url from short_url where short_url = $1",
            [code]
        );

        if(result.rows.length === 0){
            return res.status(404).send("URL not found");
        }

        res.redirect(result.rows[0].url);

    }catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    shortenUrl,
    redirectToOriginalURL
};