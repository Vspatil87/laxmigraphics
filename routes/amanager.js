var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');
const { result } = require('lodash');

router.use(cors());

// -------------------------------------------amanager--------------------------------------------------------------------

router.get('/amanager', function (req, res, next) {
    knex('customer').select('*').then(cresult => {
        knex('category').select('*').then(presult => {
            res.render('amanager', { cresult: cresult, presult: presult, title: 'Laxmi Graphics' });
        })
    })
});

// -------------------------------------------amanager customer inquiry --------------------------------------------------------------------

router.post('/amanager', function (req, res, next) {
    const Customer_name = req.body.selected_customer;
    const Company = req.body.Company;
    const VAT_number = req.body.VAT_number;
    const Phone = req.body.Mobile_number;
    const Website = req.body.Website;
    const Address = req.body.Address;
    const City = req.body.City;
    const State = req.body.State;
    const Zip_code = req.body.Zip_code;
    var customer_details = {
        customer_name: Customer_name,
        company_name: Company,
        GST_number: VAT_number,
        contact_number: Phone,
        email_id: Website,
        company_address: Address,
        city: City,
        state: State,
        zip_code: Zip_code,
    }

    console.log('customer details =', customer_details);
    knex('customer_inquiry').insert(customer_details)
        .then(() => {
            res.redirect('amanager');
        })
});

// -------------------------------------------amanager product inquiry --------------------------------------------------------------------

router.post('/amanager_product', function (req, res, next) {
    const Name = req.body.Name;
    const product_name = req.body.selected_product;
    const sub_category_name = req.body.selected_sub_category;
    knex('category').select('Uid').where('Name', Name).then(selected_category => {
        knex('sub_category').select('sub_cat_id').where('sub_category.sub_category', sub_category_name)
            .then(sub_category => {
                knex('product').select('product_id').where('product_name', product_name)
                    .then(product => {
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
                                res.redirect('amanager')
                            })
                    })
            })
    })
})

router.get('/vquotation', function (req, res, next) {
    knex('customer').select('*').then(result => {
        knex('product').select('*').then(product_name => {
            knex('quotation').select('*').then(quo => {
                knex('quotation_attributes').select('*').then(att => {
                    res.render('vquotation', { result: result, product_name: product_name, title: 'Laxmi Graphics', quo: quo, att: att });
                })
            })
        })
    })
});

router.post('/select_quotation', function (req, res, next) {
    knex('quotation').select('*').where('customer', req.body.name).first().then(quotation => {
        knex('quotation_attributes').select('*').where('estimate_no', quotation.estimate_no).first().then(attributes => {
            res.json({ quotation, attributes });
        })
    })
});

module.exports = router;
