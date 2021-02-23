var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

// -------------------------------------------------- DC ---------------------------------------------------------

// 1. Router for fetching data to DC 

router.get('/dc', function (req, res, next) {
    knex('dc').limit('1').max('dc_no as q').then(dc_no => {
        knex('customer').select('*').then(result => {
            knex('product').select('*').then(product_name => {
                res.render('dc', { product_name: product_name, dc_no: dc_no[0].q, result: result, title: 'Laxmi Graphics' });
                // res.render('dc', { product_name: product_name, result: result, title: 'Laxmi Graphics' });
            })
        })
    })
});

// 2. Router to post the quotation details at database

router.post('/insert_dc', function (req, res, next) {
    var count = req.body.count;
    console.log('customer_name = ', req.body.number);
    knex('customer').select('*').where('Company', req.body.Company)
        .then(customer => {
            var counter = 0;
            console.log('counter = ', count);
            // for (let i = 0; i < 6; i++) {
            //     // console.log('insertvalues = ', dc);
            //     knex('dc').insert({
            //         'customer': req.body.customer_name,
            //         'company': req.body.Company,
            //         'dc_date': req.body.date,
            //         'po_no': req.body.po_no,
            //         'po_date': req.body.po_date,
            //         'product': req.body.product[i],
            //         'size': req.body.size[i],
            //         'quantity': req.body.quantity[i],
            //         'note': req.body.adminnote
            //     }).then(insertdc => {
            //         console.log('insertquo = ', insertdc);
            //         res.redirect('dc');
            //     })
            // }
            // var dc = {
            //     customer: req.body.customer_name,
            //     company: req.body.Company,
            //     dc_date: req.body.date,
            //     po_no: req.body.po_no,
            //     po_date: req.body.po_date,
            //     product: req.body.product,
            //     size: req.body.size,
            //     quantity: req.body.quantity,
            //     note: req.body.adminnote
            // }
            // console.log('insertvalues = ', dc);
            // knex('dc').insert(dc).then(insertdc => {
            //     console.log('insertquo = ', insertdc);
            // })
        })
})

module.exports = router;
