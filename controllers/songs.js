const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');
let headers = {
    Authorization: `Basic ${authKey}`
}
const { Song } = require('../models');

/**
 * ============================
 * Song
 * ============================
*/

/**
 * GET ROUTES
 * */

// // GET song using SPOTIFY API
// router.get('/search', function (req, res) {
//     // Make a AXIOS call (POST) to submit CLIENT_ID and CLIENT_SECRET
//     axios.post('https://accounts.spotify.com/api/token',
//         querystring.stringify({ grant_type: 'client_credentials' }),
//         {
//             headers: headers
//         })
//         .then(function (response) {
//             token = response.data.access_token
//             console.log('TOKEN', token);
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//             // let artist = 'Pop Smoke'
//             let track = req.query.song;

//             // let query = encodeURIComponent(`${artist} ${track}`);
//             // console.log(query); // => Pop Smoke%20Welcome To The Party

//             // make another axios (GET) to get the data 
//             axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track&offset=0&limit=3`, config)
//                 .then(response => {
//                     let items = response.data.tracks.items; // array of songs data
//                     let songArray = []; // array of obj containing songs data

//                     for (const item of items) {
//                         let song = {};
//                         const songName = item.name;
//                         const artists = item.artists.map(artist => artist.name);
//                         const albumName = item.album.name;
//                         const songid = item.id;   // for embedded player
//                         song.name = songName;
//                         song.artist = artists;
//                         song.album = albumName;
//                         song.songid = songid;
//                         songArray.push(song);
//                     }
//                     res.render('search', { songs: songArray });
//                 })
//                 .catch(err => {
//                     console.log('ERROR', err);
//                 });

//         })
//         .catch(function (err) {
//             console.log("error", err.message)
//         })
// });

// GET to find all songs
router.get('/', function (req, res) {
    Song.findAll()
        .then(function (songList) {
            console.log('FOUND ALL SONGS', songList);
            res.render('songs/index', { songs: songList })
        })
        .catch(function (err) {
            console.log('ERROR', err);
            res.json({ message: 'Error occured, please try again....' });
        });
});

// router.get('/new', function (req, res) {
//     res.render('songs/new');
// });

// GET to Edit Song
router.get('/edit/:id', function (req, res) {
    let songIndex = Number(req.params.id);
    Song.findByPk(songIndex)
        .then(function (song) {
            if (song) {
                song = song.toJSON();
                res.render('songs/edit', { song });
            } else {
                console.log('This song does not exist. Send to 404 page.');
                // render a 404 page
                res.render('404', { message: 'This song does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
})

// GET by index
router.get('/:id', function (req, res) {
    let songIndex = Number(req.params.id);
    Song.findByPk(songIndex)
        .then(function (song) {
            if (song) {
                song = song.toJSON();
                res.render('songs/show', { song });
            } else {
                console.log('This song does not exist');
                // render a 404 page
                res.render('404', { message: 'This song does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
});

/**
 * POST ROUTES
 * */

// CREATE new song
router.post('/new', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
    Song.create({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        songPlayerId: req.body.songPlayerId
    })
        .then(function (newSong) {
            console.log('NEW SONG', newSong.toJSON());
            newSong = newSong.toJSON();
            res.redirect(`/songs/${newSong.id}`);
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Song was not added please try again...' });
        });
});


/**
 * EDIT
 * */

router.put('/:id', function (req, res) {
    let songIndex = Number(req.params.id);
    Song.update({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        albumCover: req.body.albumCover
    }, { where: { id: songIndex } })
        .then(function (response) {
            console.log('AFTER UPDATE', response);
            res.redirect(`/songs/${songIndex}`);
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Update was not successful. Please try again.' })
        });
});

/**
 * DELETE
 * */

router.delete('/:id', function (req, res) {
    let songIndex = Number(req.params.id);
    Song.destroy({ where: { id: songIndex } })
        .then(function (response) {
            console.log('SONG DELETED', response);
            res.redirect('/songs');
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Song was not deleted, please try again...' });
        })
});

module.exports = router;