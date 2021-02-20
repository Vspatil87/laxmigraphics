var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

// ----------------------------------------------Product---------------------------------------------------------------

// 1. Router for fetching data to table 

router.get('/product', function (req, res, next) {
    knex('product').join('sub_category', 'sub_category.sub_cat_id', '=', 'product.sub_category_id')
        .select('product.product_name', 'product.product_id', 'product.sub_category_id', 'sub_category.sub_category').then(result => {
            console.log('result=', result);
            res.render('product', { title: 'Laxmi Graphics', result: result });
        })
});

// 2. Router to fetch the add product form

router.get('/add_product', function (req, res, next) {
    knex('sub_category').select('*').then(sub_category => {
        console.log('resultofselectedsubcategory = ', sub_category);
        res.render('product_add', { result: sub_category, title: 'Laxmi Graphics' });
    })
});

// 3. Router to post the added product info at database

router.post('/add_product', function (req, res, next) {
    const Name = req.body.product_name;
    console.log("product_name = ", req.body.product_name);
    const sub_category_name = req.body.sub_category;
    console.log('sub_category_in_product = ', sub_category_name);

    knex('sub_category').select('sub_cat_id').where('sub_category', sub_category_name)
        .then(selected_sub_category => {
            console.log('selected_sub_category=', selected_sub_category);
            var user_info = {
                sub_category_id: selected_sub_category[0].sub_cat_id,
                product_name: Name,
            }
            knex('product').insert(user_info)
                .then(result => {
                    console.log("result=", result);
                    res.redirect('product')
                })
        })
})

// 4. Router to edit product 

router.get('/edit_product/:id', function (req, res, next) {
    var selected_id = { id: req.params.id };
    console.log('selected_id = ', selected_id.id);
    knex('product').select('product_id', 'product_name', 'sub_category_id')
        .innerJoin('sub_category', 'product.sub_category_id ', '=', 'sub_category.sub_cat_id')
        .where('product_id', selected_id.id)
        .then(sub_cat => {
            console.log('sub_cat', sub_cat);
            knex('sub_category').select('*').then(all_category => {
                console.log('all_category', all_category);
                if (all_category) {
                    console.log('sub_cat ', sub_cat);
                    res.render('product_update', {
                        all_category: all_category,
                        sub_cat: sub_cat
                    })
                }
                else {
                    req.flash('error', 'Sub Category not found with id = ' + req.params.id)
                    res.redirect('product')
                }
            }).catch(error => console.error())
        }).catch(error => console.error())
})

// 5. Router to update product 

router.post('/product_update/:id', function (req, res, next) {
    var id = { id: req.params.id };
    const name = req.body.sub_category;
    knex('sub_category').select('sub_cat_id').where('sub_category', name)
        .then(selected_sub_category => {
            console.log('selected_sub_category=', selected_sub_category);
            var product_update = {
                sub_category_id: selected_sub_category[0].sub_cat_id,
                product_name: req.body.product_name
            }
            knex('product').update(product_update).where('product_id', req.params.id).then(result => {
                console.log('product_result = ', result);
                res.redirect('/product/product')
            })
        })
})

// 6. Router to delete product 

router.get('/product_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('product_id = ', user.id)

    {
        knex('product').where('product_id', user.id).del()
            .then(() => {
                res.redirect('/product/product');
            })
    }
})


// --------------------------------------------Product Details--------------------------------------------

// 1. Router for fetching joined data to table 

router.get('/product_details', function (req, res, next) {
    knex('product_details')
        .join('product', 'product_details.product', '=', 'product.product_id')
        .join('sub_category', 'sub_category.sub_cat_id', '=', 'product_details.sub_category')
        .join('category', 'category.Uid', '=', 'product_details.category')
        .select('product_details.product_details_id', 'product.product_name', 'category.Name', 'sub_category.sub_category', 'product_details.additional_category', 'product_details.specification', 'product_details.size', 'product_details.unit', 'product_details.rate', 'product_details.quantity', 'product_details.amount')
        .then(result => {
            console.log('resultofjoin =', result);
            res.render('product_details', { title: 'Laxmi Graphics', result: result })
        })
});

// 2. Router to fetch the add product details form 

router.get('/add_product_details', function (req, res, next) {
    knex.select('*').from('category')
        .then(sel => {
            console.log('result_of_selected_category=', sel);
            res.render('product_details_add', { result: sel, title: 'Laxmi Graphics' });
        })
})

// 3. Router to post the added product details info at database

router.post('/add_product_details', function (req, res, next) {
    console.log('category = ', req.body.Name);
    const Name = req.body.Name;
    const product_name = req.body.selected_product;
    const sub_category_name = req.body.selected_sub_category;
    console.log("sub_category_name = ", sub_category_name);
    console.log("product_name = ", product_name);
    knex('category').select('Uid').where('Name', Name).then(selected_category => {
        knex('sub_category').select('sub_cat_id').where('sub_category.sub_category', sub_category_name)
            .then(sub_category => {
                console.log('sub_category = ', sub_category[0]);
                knex('product').select('product_id').where('product_name', product_name)
                    .then(product => {
                        console.log('product = ', product[0]);
                        var user_info = {
                            category: selected_category[0].Uid,
                            product: product[0].product_id,
                            sub_category: sub_category[0].sub_cat_id,
                            additional_category: req.body.additional_category,
                            specification: req.body.specification,
                            size: req.body.size,
                            unit: req.body.unit,
                            rate: req.body.rate,
                            quantity: req.body.quantity,
                            amount: req.body.amount
                        }
                        knex('product_details').insert(user_info)
                            .then(result => {
                                console.log("result=", result);
                                res.redirect('product_details')
                            })
                    })
            })
    })
})

// 4. Router to delete product details 

router.get('/product_details_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('product_details_id = ', user.id)
    {
        knex('product_details').where('product_details_id', user.id).del()
            .then(() => {
                res.redirect('/product/product_details');
            })
    }
})

// 5. Router to edit product details 

router.get('/edit_product_details/:id', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('edit_user = ', user.id);
    knex('product_details').select('*').where('product_details_id', user.id)
        .join('category', 'category.Uid', '=', 'product_details.category')
        .join('sub_category', 'sub_category.sub_cat_id', '=', 'product_details.sub_category')
        .join('product', 'product.product_id', '=', 'product_details.product')
        .then(user => {
            console.log('user=', user[0].sub_category);
            if (user) {
                res.render('product_details_update', {
                    details: user
                })
            }
            else {
                req.flash('error', 'product details not found with id = ' + req.params.id)
                res.redirect('product_details')
            }
        })
})

// 6. Router to update product details 

router.post('/update_product_details/:id', function (req, res, next) {
    knex('category').select('Uid').where('Name', req.body.category).then(category_uid => {
        knex('sub_category').select('sub_cat_id').where('sub_category', req.body.sub_category).then(sub_category_id => {
            knex('product').select('product_id').where('product_name', req.body.product_name).then(product_id => {
                console.log('category_uid = ', category_uid[0].Uid);
                var details_update = {
                    category: category_uid[0].Uid,
                    product: product_id[0].product_id,
                    sub_category: sub_category_id[0].sub_cat_id,
                    additional_category: req.body.additional_category,
                    specification: req.body.specification,
                    size: req.body.size,
                    unit: req.body.unit,
                    rate: req.body.rate,
                    quantity: req.body.quantity,
                    amount: req.body.amount,
                }
                knex('product_details').update(details_update).where('product_details_id', req.params.id).then(result => {
                    console.log('resultofproductdetails = ', result);
                    res.redirect('/product/product_details')
                })
            })
        })
    })
})

// 7. Router to select and fetch the sub category from sub category table using category

router.post('/select_category', function (req, res, next) {
    console.log('name=', req.body.name)
    knex('category')
        .join('sub_category', 'category.Uid', '=', 'sub_category.main_category_id')
        .select('sub_category').where('category.Name', req.body.name).then(sel => {
            res.json({ sel });
            console.log(sel);
        })
})

// 7. Router to select and fetch the product from product table using sub category

router.post('/select_product', function (req, res, next) {
    console.log('selected_product_name=', req.body.name)
    knex('sub_category')
        .join('product', 'sub_category.sub_cat_id', '=', 'product.sub_category_id')
        .select('product_name').where('sub_category.sub_category', req.body.name).then(product => {
            console.log('product = ', product);
            res.json({ product });
        })
})


module.exports = router;
