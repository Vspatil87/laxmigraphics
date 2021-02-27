var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');
const Knex = require('knex');

router.use(cors());

router.get('/das', function (req, res, next) {
    knex('sub_category').count('sub_cat_id as sca').then(subcategory => {
        knex('customer').count('Uid as c').then(customer => {
            knex('vendor').count('Uid as v').then(vendor => {
                knex('product').count('product_id as p').then(product => {
                    knex('employee').count('Uid as e').then(employee => {
                        knex('invoice').select('*').then(invoice => {
                            knex('category').count('Uid as ca').then(category => {
                                knex('customer_inquiry').count('customer_id as i').then(inquiry => {
                                    knex('quotation').count('estimate_no as q').then(quotation => {
                                        res.render('das', { title: 'Laxmi Graphics', inquiry: inquiry[0].i, quotation: quotation[0].q, category: category[0].ca, subcategory: subcategory[0].sca, invoice: invoice, customer: customer[0].c, vendor: vendor[0].v, product: product[0].p, employee: employee[0].e });
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});



module.exports = router;
