const express = require('express');
const router = express.Router();
const {
    Category,
    School,
    CategorySong,
    Song
} = require('../models');

/**
 * ============================
 * Brackets
 * ============================
*/
/**
 * GET ROUTES
 * */

// GET to display main bracket
router.get('/', function (req, res) {
    Song.findAll()
        .then(function (songList) {
            console.log('FOUND ALL SONGS', songList);
            res.render('brackets/index', { songs: songList })
        })
        .catch(function (err) {
            console.log('ERROR', err);
            res.json({ message: 'Error occured, please try again....' });
        });
});

router.get('/new', function (req, res) {
    res.render('brackets/new');
});


module.exports = router;