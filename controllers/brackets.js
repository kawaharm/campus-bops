const express = require('express');
const router = express.Router();
const {
    Category,
    School,
    CategorySong
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
    Category.findAll()
        .then(function (categoryList) {
            console.log('FOUND ALL CATEGORIES', categoryList);
            res.render('brackets/index', { categories: categoryList })
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