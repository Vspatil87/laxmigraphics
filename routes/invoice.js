var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

// ---------------------------------------------------Invoice-----------------------------------------------------------

// 1. Router for fetching data to invoice 

router.get('/invoice', function (req, res, next) {
    knex('invoice').limit('1').max('invoice_no as n').then(invoice => {
        console.log('invoice_no = ', invoice[0].n);
        knex('customer').select('*').then(result => {
            knex('product').select('*').then(product_name => {
                res.render('invoice', { product_name: product_name, invoice: invoice[0].n, result: result, title: 'Laxmi Graphics' });
            })
        })
    })
});

// 2. Router to select and fetch the data from product and product details table

router.post('/invoice_select_details', function (req, res, next) {
    console.log('product name =', req.body.product);
    knex('product').select('product_id').where('product_name', req.body.product).then(product => {
        console.log('product_id = ', product[0]);
        knex('product_details').select('*').where('product', product[0].product_id).then(details => {
            res.json({ details });
            console.log('details = ', details);
        })
    })
});

// 3. Router to select and fetch the data from customer table

router.post('/invoice_select_company', function (req, res, next) {
    console.log('customer name =', req.body.name);
    knex('customer').select('*').where('Customer_name', req.body.name).then(company => {
        console.log('company = ', company);
        res.json({ company });
    })
});

// 4. Router to select and fetch the data from customer table

router.post('/invoice_select_address', function (req, res, next) {
    console.log('name =', req.body.name);
    knex('customer').select('*').where('Company', req.body.name).then(address => {
        console.log('address = ', address);
        res.json({ address });
    })
});

// 5. Router to select and fetch the data from customer table

router.post('/invoice_select_saddress', function (req, res, next) {
    console.log('name =', req.body.name);
    knex('customer').select('*').where('Company', req.body.name).then(address => {
        console.log('address = ', address);
        res.json({ address });
    })
});

// 6. Router to post the invoice details at database

router.post('/insert_invoice', function (req, res, next) {
    var count = req.body.count;
    knex('customer').select('*').where('Company', req.body.Company)
        .then(customer => {
            var invoice = {
                customer: req.body.customer_name,
                company: req.body.Company,
                bill_address: req.body.baddress,
                bill_city: req.body.bcity,
                bill_state: req.body.bstate,
                bill_zip_code: req.body.bzipcode,
                ship_address: req.body.saddress,
                ship_city: req.body.scity,
                ship_state: req.body.sstate,
                ship_zip_code: req.body.szipcode,
                payment_mode: req.body.mode,
                invoice_date: req.body.date,
                due_date: req.body.duedate,
                rate: req.body.price,
                status: req.body.status,
                sale_agent: req.body.saleagent,
                discount: req.body.discount,
                note: req.body.adminnote
            }
            console.log('insertvalues = ', invoice);
            knex('invoice').insert(invoice).then(insertinvoice => {
                console.log('insertinvoice = ', insertinvoice);
            })
        })

    for (let i = 0; i <= count; i++) {
        knex('invoice_attributes').insert({
            'invoice_no': req.body.number,
            'item': req.body.product_name[i],
            'quantity': req.body.quantity[i],
            'unit': req.body.unit[i],
            'rate': req.body.rate[i],
            'tax': req.body.GST[i],
            'amount': req.body.amount[i]
        }
        ).then(insertiattributes => {
            console.log('insertattributes = ', insertiattributes);
            res.redirect('invoice');
        })
    }
})

module.exports = router;
