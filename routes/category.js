var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

//------------------------------------------------category-----------------------------------------------

// 1. Router for fetching data to table 

router.get('/category', function (req, res, next) {
    knex('category').select('*').then(result => {
        res.render('category', { title: 'Laxmi Graphics', result: result });
    })
})

// 2. Router to fetch the add category form 

router.get('/add_category', function (req, res, next) {
    res.render('category_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added category info at database

router.post('/add_category', function (req, res, next) {
    const Name = req.body.Name;
    console.log('name = ', Name);
    var category_info = {
        Name: Name
    }

    knex('category').insert(category_info)
        .then(result => {
            console.log("result=", result);
            res.redirect('category')
        })
})

// 4. Router to delete category 

router.get('/category_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('user = ', user.id)
    {
        knex('category').where('Uid', user.id).del()
            .then(() => {
                res.redirect('/category/category');
            })
    }
})

// 5. Router to edit category 

router.get('/edit_category/:id', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('edit_user = ', user.id);
    knex('category').select('*').where('Uid', user.id).first().then(user => {
        console.log('user=', user.Name);
        if (user) {
            res.render('category_update', {
                Uid: user.Uid,
                Name: user.Name
            })
        }
        else {
            req.flash('error', 'Category not found with id = ' + req.params.id)
            res.redirect('category')
        }
    })
})

// 6. Router to update category 

router.post('/category_update/:id', function (req, res, next) {

    var user_update = {
        Name: req.body.Name
    }
    knex('category').update(user_update).where('Uid', req.params.id).then(result => {
        console.log('category_result = ', result);
        res.redirect('/category/category')
    })
})


// --------------------------------------------Sub Category---------------------------------------------------

// 1. Router for fetching data to table 

router.get('/sub_category', function (req, res, next) {
    knex('sub_category').join('category', 'sub_category.main_category_id', '=', 'category.Uid')
        .select('sub_category.sub_cat_id', 'sub_category.main_category_id', 'category.Name', 'sub_category.sub_category')
        .then(cat => {
            console.log('cat', cat);
            res.render('sub_category', { title: 'Laxmi Graphics', cat: cat })
        })
})

// 2. Router to fetch the add subcategory form 

router.get('/add_sub_category', function (req, res, next) {
    knex('category').select('*').then(sel => {
        console.log('result_of_selected_category=', sel);
        res.render('sub_category_add', { result: sel, title: 'Laxmi Graphics' });
    })
})

// 3. Router to post the added subcategory info at database

router.post('/add_sub_category', function (req, res, next) {
    const Name = req.body.select_category;
    console.log('selected_name = ', Name);
    knex('category').select('Uid').where('Name', Name).then(selected_category => {
        console.log('selected_category', selected_category);
        var sub_category_info = {
            main_category_id: selected_category[0].Uid,
            sub_category: req.body.sub_category
        }
        knex('sub_category').insert(sub_category_info)
            .then(result => {
                console.log("result=", result);
                res.redirect('sub_category')

            })
    })
})

// 4. Router to delete subcategory 

router.get('/edit_sub_category/:id', function (req, res, next) {
    var selected_subcat_id = { id: req.params.id };
    console.log('selected_subcat_id = ', selected_subcat_id.id);
    knex('sub_category').select('Uid', 'sub_category', 'sub_cat_id')
        .innerJoin('category', 'sub_category.main_category_id ', '=', 'category.Uid')
        .where('sub_cat_id', selected_subcat_id.id)
        .then(cat_subcat => {
            console.log('cat_subcat', cat_subcat);
            knex('category').select('*').then(all_category => {
                console.log('all_category', all_category);
                if (all_category) {
                    console.log('cat_subcat ', cat_subcat);
                    res.render('sub_category_update', {
                        all_category: all_category,
                        cat_subcat: cat_subcat
                    })
                }
                else {
                    req.flash('error', 'Sub Category not found with id = ' + req.params.id)
                    res.redirect('sub_category')
                }
            }).catch(error => console.error())
        }).catch(error => console.error())
})

// 5. Router to edit subcategory 

router.post('/sub_category_update/:id', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('id=', user)
    const Name = req.body.select_category;
    console.log('name=', Name);
    knex('category').select('Uid').where('Name', Name).then(selected_category => {
        console.log('selected_category', selected_category);
        var sub_category_info = {
            main_category_id: selected_category[0].Uid,
            sub_category: req.body.sub_category
        }
        console.log('sub_category=', sub_category_info);
        knex('sub_category').update(sub_category_info).where('sub_cat_id', user.id).then(result => {
            console.log('sub_category_result = ', result);
            res.redirect('/category/sub_category')
        })
    })
})

// 6. Router to update subcategory 

router.get('/sub_category_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('user = ', user.id)
    {
        knex('sub_category').where('sub_cat_id', user.id).del()
            .then(() => {
                res.redirect('/category/sub_category');
            })
    }
})

module.exports = router;
