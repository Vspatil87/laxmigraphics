var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());


// ---------------------------------------------customer Inquiry--------------------------------------------------

// 1. Router for fetching data to table 

router.get('/customer_inquiry', function (req, res, next) {
    knex('customer_inquiry').select('*').then(selected_customer => {
        console.log('result_of_customer_inquiry=', selected_customer);
        res.render('customer_inquiry', { result: selected_customer, title: 'Laxmi Graphics' });
    })
})

// 2. Router to fetch the add inquiry form 

router.get('/add_customer_inquiry', function (req, res, next) {
    knex('customer').select('*').then(result => {
        res.render('customer_inquiry_add', { result: result, title: 'Laxmi Graphics' });
    })
});

// 3. Router to post the added inquiry info at database

router.post('/add_customer_inquiry', function (req, res, next) {
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
        .then(result => {
            console.log("result_customer=", result);
            res.redirect('customer_inquiry');
        })
})

// 4. Router to delete inquiry 

router.get('/customer_inquiry_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('user = ', user.id)

    {
        knex('customer_inquiry').where('customer_id', user.id).del()
            .then(() => {
                res.redirect('/inquiry/customer_inquiry');
            })
    }
})

// 5. Router to edit inquiry 

router.get('/edit_customer_inquiry/:id', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('edit_inquiry = ', user.id);
    knex('customer_inquiry').select('*').where('customer_id', user.id)
        .then(customer => {
            console.log('customer=', customer);
            if (customer) {
                res.render('customer_inquiry_update', {
                    customer: customer
                })
            }
            else {
                req.flash('error', 'Customers not found with id = ' + req.params.id);
                res.redirect('customer_inquiry')
            }
        })
})

// 6. Router to update inquiry 

router.post('/update_customer_inquiry/:id', function (req, res, next) {
    var inquiry_update = {
        customer_name: req.body.customer,
        company_name: req.body.company,
        GST_number: req.body.GST_number,
        contact_number: req.body.contact_number,
        email_id: req.body.email_id,
        company_address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code
    }
    knex('customer_inquiry').update(inquiry_update).where('customer_id', req.params.id).then(result => {
        console.log('result = ', result);
        res.redirect('/inquiry/customer_inquiry')
    })
})

// 7. Router to select and fetch the data from customer table

router.post('/customer_select', function (req, res, next) {
    var id = req.body.name;
    console.log('id = ', id);
    knex('customer').select('*').where('Customer_name', id).then((resultofcustomer) => {
        res.json({ resultofcustomer });
        console.log('resultofcustomer = ', resultofcustomer);
    })
})

module.exports = router;
