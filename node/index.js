const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 7000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/scrape', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(decodeURIComponent(url));
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrape the desired data
        // Example: Extract all the links from the page
        const links = [];
        $('tr').each((i, el) => {
            const elem = $(el).find('.name').find('a').eq(1);
            const seeders = $(el).find('.coll-2.seeds').text();
            const leechers = $(el).find('.coll-3.leeches').text();
            const uploader = $(el).find('.uploader').text();
            const size = $(el).find('.size').clone().children().remove().end().text().trim()
            if (elem.attr('href')) {
                links.push({
                    name: elem.text(),
                    slug: elem.attr('href'),
                    type: '1337x',
                    seeders: parseFloat(seeders),
                    leechers: parseFloat(leechers),
                    username: uploader,
                    sizeText: size
                });
            }
        });

        res.json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape the URL' });
    }
});


app.get('/scrape/extract', async (req, res) => {
    const { slug,type } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(`https://1337x.to${decodeURIComponent(slug)}`);
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrape the desired data
        // Example: Extract all the links from the page
        const links = {
            magnate: $('#openPopup').attr('href'),
            hash: $('.infohash-box p span').text()
        }

        res.json(links);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape the URL' });
    }
});

app.get('/scrape/cros', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.get(decodeURIComponent(url));
        res.json(response.data)
    } catch (error) {
        // console.error(error);
        console.log(url)
        res.status(500).json({ error: 'Failed to scrape the URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
