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
    res.render('categories/new');
});

// GET to Edit Category
router.get('/edit/:id', function (req, res) {
    let categoryIndex = Number(req.params.id);
    Category.findByPk(categoryIndex)
        .then(function (category) {
            if (category) {
                category = category.toJSON();
                res.render('categories/edit', { category });
            } else {
                console.log('This category does not exist. Send to 404 page.');
                // render a 404 page
                res.render('404', { message: 'This category does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
})

// GET by index
router.get('/:id', function (req, res) {
    let categoryIndex = Number(req.params.id);
    Category.findByPk(categoryIndex)
        .then(function (category) {
            if (category) {
                category = category.toJSON();
                res.render('categories/show', { category });
            } else {
                console.log('This category does not exist');
                // render a 404 page
                res.render('404', { message: 'This category does not exist' });
            }
        })
        .catch(function (error) {
            console.log('ERROR', error);
        });
});

/**
 * POST ROUTES
 * */

// CREATE new category
router.post('/', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
    Category.create({
        name: req.body.name
    })
        .then(function (newCategory) {
            console.log('NEW CATEGORY', newCategory.toJSON());
            newCategory = newCategory.toJSON();
            res.redirect(`/categories/${newCategory.id}`);
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Category was not added please try again...' });
        });
});

/**
 * EDIT
 * */

router.put('/:id', function (req, res) {
    let categoryIndex = Number(req.params.id);
    Category.update({
        name: req.params.name
    }, { where: { id: categoryIndex } })
        .then(function (response) {
            console.log('AFTER UPDATE', response);
            res.redirect(`/categories/${categoryIndex}`);
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
    let categoryIndex = Number(req.params.id);
    Category.destroy({ where: { id: categoryIndex } })
        .then(function (response) {
            console.log('CATEGORY DELETED', response);
            res.redirect('/categories');
        })
        .catch(function (error) {
            console.log('ERROR', error);
            res.render('404', { message: 'Category was not deleted, please try again...' });
        })
});

module.exports = router;
