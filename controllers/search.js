const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');
let headers = {
    Authorization: `Basic ${authKey}`
}

/**
 * ============================
 * Search
 * ============================
*/

/**
 * GET ROUTES
 * */

// SEARCH BY SONG
router.get('/', function (req, res) {
    // Make a AXIOS call (POST) to submit CLIENT_ID and CLIENT_SECRET
    axios.post('https://accounts.spotify.com/api/token',
        querystring.stringify({ grant_type: 'client_credentials' }),
        {
            headers: headers
        })
        .then(function (response) {
            token = response.data.access_token
            console.log('TOKEN', token);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // let artist = 'Pop Smoke'
            let track = req.query.song;

            // let query = encodeURIComponent(`${artist} ${track}`);
            // console.log(query); // => Pop Smoke%20Welcome To The Party

            // make another axios (GET) to get the data 
            axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=3`, config)
                .then(response => {
                    let items = response.data.tracks.items; // array of songs data
                    let songArray = []; // array of obj containing songs data

                    for (const item of items) {
                        let song = {};
                        const songName = item.name;
                        const artists = item.artists.map(artist => artist.name);
                        const albumName = item.album.name;
                        const songId = item.id;   // for embedded player
                        song.name = songName;
                        song.artist = artists;
                        song.album = albumName;
                        song.songId = songId;
                        songArray.push(song);
                    }
                    res.render('search', { songs: songArray });
                })
                .catch(err => {
                    console.log('ERROR', err);
                });

        })
        .catch(function (err) {
            console.log("error", err.message)
        })
});


module.exports = router;