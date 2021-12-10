const express = require('express');
const router = express.Router();
const { School } = require('../models');
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
            console.log('FOUND ALL SCHOOLS', schoolList);
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

// GET by school name
router.get('/:abbv', function (req, res) {
    School.findOne({ where: { abbv: req.params.abbv } })
        .then(function (school) {
            if (school) {
                school = school.toJSON();
                res.render('schools/show', { school });
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

/**
 * EDIT
 * */

router.put('/:id', function (req, res) {
    School.update({
        name: req.body.name,
        location: req.body.location,
        logo: req.body.logo,
        abbv: req.body.abbv
    }, { where: { id: schoolIndex } })
        .then(function (response) {
            console.log('AFTER UPDATE', response);
            res.redirect(`/schools/${response.id}`);
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
