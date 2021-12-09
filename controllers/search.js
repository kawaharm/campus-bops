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
                    // const artistIterate = function (array) {    // lists all artists in artist array
                    //     let artistArray = [];
                    //     array.forEach(artist => {
                    //         artistArray.push(artist.name);
                    //     })
                    //     return artistArray;
                    // }
                    const albums = response.data.tracks.items;
                    for (const k of albums) {
                        const artists = k.artists.map(artist => artist.name);
                        console.log(artists);
                    }


                    let songArray = response.data.tracks.items;
                    res.render('search', { data: songArray });
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