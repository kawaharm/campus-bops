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

            // Define song variable using value from song search bar
            let track = req.query.song;

            // Make another axios (GET) to retrieve song data 
            axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=5`, config)
                .then(response => {
                    let items = response.data.tracks.items; // Array of songs data
                    let songArray = []; // Array of obj containing songs data

                    // Encapsulate each song data into an object and push into songArray
                    for (const item of items) {
                        let song = {};
                        const songTitle = item.name;
                        const artists = item.artists.map(artist => artist.name);    // Map artist array to obtain all artists in song 
                        const albumName = item.album.name;
                        const songPlayerId = item.id;   // For embedded player
                        song.title = songTitle;
                        song.artist = artists;
                        song.album = albumName;
                        song.songPlayerId = songPlayerId;
                        songArray.push(song);
                    }
                    // Render songs into search.ejs file
                    res.render('search', { songs: songArray });
                })
                .catch(err => {
                    console.log('ERROR', err);
                });

        })
        .catch(function (err) {
            console.log("ERROR", err.message)
        })
});


module.exports = router;