var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());


// --------------------------------------------------Quotation---------------------------------------------------------

// 1. Router for fetching data to quotation 

router.get('/quotation', function (req, res, next) {
    knex('quotation').limit('1').max('estimate_no as q').then(estimate_no => {
      knex('customer').select('*').then(result => {
        knex('product').select('*').then(product_name => {
          res.render('quotation', { product_name: product_name, estimate_no: estimate_no[0].q, result: result, title: 'Laxmi Graphics' });
        })
      })
    })
  });
  
// 2. Router to select and fetch the data from product and product details table

  router.post('/select_details', function (req, res, next) {
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

  router.post('/select_company', function (req, res, next) {
    console.log('customer name =', req.body.name);
    knex('customer').select('*').where('Customer_name', req.body.name).then(company => {
      console.log('company = ', company);
      res.json({ company });
    })
  });
  
// 4. Router to select and fetch the data from customer table

  router.post('/select_address', function (req, res, next) {
    console.log('name =', req.body.name);
    knex('customer').select('*').where('Company', req.body.name).then(address => {
      console.log('address = ', address);
      res.json({ address });
    })
  });
  
// 5. Router to select and fetch the data from customer table

  router.post('/select_saddress', function (req, res, next) {
    console.log('name =', req.body.name);
    knex('customer').select('*').where('Company', req.body.name).then(address => {
      console.log('address = ', address);
      res.json({ address });
    })
  });
  
// 6. Router to post the quotation details at database

  router.post('/insert_quotation', function (req, res, next) {
    console.log('customer_name = ' , req.body.customer_name);
    knex('customer').select('*').where('Company', req.body.Company)
      .then(customer => {
        var quotation = {
          customer:req.body.customer_name,
          company: req.body.Company,
          bill_address: req.body.baddress,
          bill_city: req.body.bcity,
          bill_state: req.body.bstate,
          bill_zip_code: req.body.bzipcode,
          ship_address:req.body.saddress,
          ship_city: req.body.scity,
          ship_state:req.body.sstate,
          ship_zip_code: req.body.szipcode,
          estimate_date: req.body.date,
          expiry_date: req.body.expirydate,
          rate: req.body.price,
          status: req.body.status,
          sale_agent: req.body.saleagent,
          discount: req.body.discount,
          note: req.body.adminnote
        }
        console.log('insertvalues = ', quotation);
        knex('quotation').insert(quotation).then(insertquotation => {
          console.log('insertquo = ', insertquotation);
          // res.redirect('quotation');
        })
      })
  
      var qattributes = {
        estimate_no : req.body.number,
        item : req.body.product_name,
        quantity: req.body.quantity,
        unit : req.body.unit,
        rate : req.body.rate,
        tax : req.body.GST,
        amount : req.body.amount,
      }
      knex('quotation_attributes').insert(qattributes).then(insertqattributes => {
        console.log('insertattributes = ', insertqattributes);
        res.redirect('quotation');
      })
  })

module.exports = router;
