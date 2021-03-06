const express = require('express');
const router = express.Router();
const {
    School,
    Category,
    Song
} = require('../models');
/**
 * ============================
 * Schools
 * ============================
*/
/**
 * GET ROUTES
 * */

// GET to find all schools
router.get('/', function (req, res) {
    School.findAll()
        .then(function (schoolList) {
            res.render('schools/index', { schools: schoolList })
        })
        .catch(function (err) {
            console.log('ERROR', err);
            res.json({ message: 'Error occured, please try again....' });
        });
});

router.get('/new', function (req, res) {
    res.render('schools/new');
});

// GET to Edit School
router.get('/edit/:abbv', function (req, res) {
    School.findOne({ where: { abbv: req.params.abbv } })
        .then(function (school) {
            if (school) {
                school = school.toJSON();
                res.render('schools/edit', { school });
            } else {
                console.log('This school does not exist. Send to 404 page.');
                // render a 404 page
                res.render('404', { message: 'This school does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
})

// GET School by abbreviation
router.get('/:abbv', function (req, res) {
    console.log('does abbv come out?', req.params.abbv);
    School.findOne({ where: { abbv: req.params.abbv } })
        .then(function (school) {
            if (school) {
                school.getCategories()  // Show all categories associated with school
                    .then(function (categories) {
                        res.render('schools/show', { school, categories });
                    })
                    .catch(function (err) {
                        console.log('ERROR with CATEGORIES', err);
                    })
            } else {
                console.log('This school does not exist');
                // render a 404 page
                res.render('404', { message: 'This school does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
});
/**
 * POST ROUTES
 * */

// CREATE new school
router.post('/', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
    School.create({
        name: req.body.name,
        location: req.body.location,
        logo: req.body.logo,
        abbv: req.body.abbv
    })
        .then(function (newSchool) {
            console.log('NEW SCHOOL', newSchool.toJSON());
            newSchool = newSchool.toJSON();
            res.redirect(`/schools/${newSchool.abbv}`);
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'School was not added please try again...' });
        });
});

// Search for school from homepage
router.post('/search', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
    School.findOne({ where: { abbv: req.body.schoolAbbv } })
        .then(function (foundSchool) {
            console.log('FOUND SCHOOL', foundSchool.toJSON());
            res.redirect(`/schools/${foundSchool.abbv}`);
        })
        .catch(function (error) {
            console.log('ERROR: SCHOOL WAS NOT FOUND', error);
            res.render('404', { message: 'School was not found. please try again...' });
        });
})

/**
 * EDIT
 * */

router.put('/:id', function (req, res) {
    let schoolIndex = Number(req.params.id);
    School.update({
        name: req.body.name,
        location: req.body.location,
        logo: req.body.logo,
        abbv: req.body.abbv
    }, { where: { id: schoolIndex } })
        .then(function (response) {
            console.log('AFTER UPDATE', response);
            res.redirect(`/schools/${response.abbv}`);
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
    let schoolIndex = Number(req.params.id);
    School.destroy({ where: { id: schoolIndex } })
        .then(function (response) {
            console.log('SCHOOL DELETED', response);
            res.redirect('/schools');
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'School was not deleted, please try again...' });
        })
});

module.exports = router;
