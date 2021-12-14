const express = require('express');
const router = express.Router();
const {
    Category,
    School,
    CategorySong
} = require('../models');

/**
 * ============================
 * Categories
 * ============================
*/
/**
 * GET ROUTES
 * */

// GET to find all categories
router.get('/', function (req, res) {
    Category.findAll()
        .then(function (categoryList) {
            console.log('FOUND ALL CATEGORIES', categoryList);
            res.render('categories/index', { categories: categoryList })
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
                category.getSongs()
                    .then(function (songs) {
                        res.render('categories/edit', { category, songs });
                    })
                    .catch(function (err) {
                        console.log('ERROR', err);
                    })
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
                category.getSongs()
                    .then(function (songs) {
                        if (songs) {
                            category = category.toJSON();
                            res.render('categories/show', { category, songs });
                        } else {
                            console.log('Songs do not exist in this category');
                            // render a 404 page
                            res.render('404', { message: 'Songs do not exist in this category' });
                        }
                    })
                    .catch(function (err) {
                        console.log('ERROR', err)
                    })
            } else {
                console.log('This category does not exist');
                // render a 404 page
                res.render('404', { message: 'This category does not exist' });
            }
        })
        .catch(function (err) {
            console.log('ERROR', err);
        });
});

/**
 * POST ROUTES
 * */

// CREATE new category
router.post('/', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
    Category.create({
        name: req.body.name,
        schoolid: req.body.schoolid,
        userid: req.body.userid
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

// ADD new song to exist Category
router.post('/newSong', function (req, res) {
    console.log('SUBMITTED FORM', req.body);
})
//         .then(function (newCategory) {
//             console.log('NEW CATEGORY', newCategory.toJSON());
//             newCategory = newCategory.toJSON();
//             res.redirect(`/categories/${newCategory.id}`);
//         })
//         .catch(function (error) {
//             console.log('ERROR', error);
//             res.render('404', { message: 'Category was not added please try again...' });
//         });
// });

/**
 * EDIT
 * */

router.put('/:id', function (req, res) {
    let categoryIndex = Number(req.params.id);
    Category.update({
        name: req.params.name,
        schoolid: req.body.schoolid,
        userid: req.body.userid
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