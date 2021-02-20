var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

/* GET users listing. */
router.get('/table', function (req, res, next) {
  res.render('datatable', { title: 'Laxmi Graphics' });
});

router.get('/login', function (req, res, next) {
  res.render('LG_login', { title: 'Laxmi Graphics' });
});

// ----------------------------------------------customer--------------------------------------------------

// 1. Router for fetching data to table 

router.get('/customer', function (req, res, next) {
  knex('customer').select('*').then(result => {
    console.log('result=', result);
    res.render('customer', { title: 'Laxmi Graphics', result: result });  
  })
});

// 2. Router to fetch the add customer form

router.get('/add_customer', function (req, res, next) {
  res.render('customer_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added customer info at database

router.post('/add_customer', function (req, res, next) {
  const Customer_name = req.body.Customer_name;
  const Company = req.body.Company;
  const VAT_number = req.body.VAT_number;
  const Phone = req.body.Mobile_number;
  const Website = req.body.Website;
  const Address = req.body.Address;
  const City = req.body.City;
  const State = req.body.State;
  const Zip_code = req.body.Zip_code;
  var customer_info = {
    Customer_name: Customer_name,
    Company: Company,
    VAT_number: VAT_number,
    Phone: Phone,
    Website: Website,
    Address: Address,
    City: City,
    State: State,
    Zip_code: Zip_code
  }
  knex('customer').insert(customer_info)
    .then(result => {
      console.log("result=", result);
      res.redirect('customer')
    })
})

// 4. Router to edit customer 

router.get('/edit/:id', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('edit_user = ', user.id);
  knex('customer').select('*').where('Uid', user.id).first().then(user => {
    console.log('user=', user.Company);
    if (user) {
      res.render('customer_update', {

        Uid: user.Uid,
        Customer_name: user.Customer_name,
        Company: user.Company,
        VAT_number: user.VAT_number,
        Mobile_number: user.Phone,
        Website: user.Website,
        Address: user.Address,
        City: user.City,
        State: user.State,
        Zip_code: user.Zip_code
      })
    }
    else {
      req.flash('error', 'Customers not found with id = ' + req.params.id)
      res.redirect('customer')
    }
  })
})

// 5. Router to update customer 

router.post('/customer_update/:id', function (req, res, next) {
  var user_update = {
    Customer_name: req.body.Customer_name,
    Company: req.body.Company,
    VAT_number: req.body.VAT_number,
    Phone: req.body.Mobile_number,
    Website: req.body.Website,
    Address: req.body.Address,
    City: req.body.City,
    State: req.body.State,
    Zip_code: req.body.Zip_code
  }
  knex('customer').update(user_update).where('Uid', req.params.id).then(result => {
    console.log('result = ', result);
    res.redirect('/users/customer')
  })
})

// 6. Router to delete customer 

router.get('/customer_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)

  {
    knex('customer').where('Uid', user.id).del()
      .then(() => {
        res.redirect('/users/customer');
      })
  }
})


// ---------------------------------------Employee-----------------------------------------------------

// 1. Router for fetching data to table 

router.get('/employee', function (req, res, next) {
  knex('employee').select('*').then(result => {
    console.log('result=', result);
    res.render('employee', { title: 'Laxmi Graphics', result: result });   
  })
});

// 2. Router to fetch the add employee form

router.get('/add_employee', function (req, res, next) {
  res.render('employee_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added employee info at database

router.post('/add_employee', function (req, res, next) {
  console.log("DOB", req.body.DOB);
  const Name = req.body.employee_name;
  const mobile_number = req.body.mobile_number;
  const alternate_mb_no = req.body.alternate_mb_no;
  const Email = req.body.email_id;
  const DOB = req.body.DOB;
  const Address = req.body.address;
  const Password = req.body.password;
  var user_info = {
    Name: Name,
    mobile_number: mobile_number,
    alternate_mobile_number: alternate_mb_no,
    Email: Email,
    DOB: DOB,
    Address: Address,
    Password: Password,
  }
  knex('employee').insert(user_info)
    .then(result => {
      console.log("result=", result);
      res.redirect('employee')
    })

})

// 4. Router to edit employee 

router.get('/edit_employee/:id', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('employee_edit_user = ', user.id);
  knex('employee').select('*').where('Uid', user.id).first().then(user => {
    console.log('user=', user.Name);
    if (user) {
      res.render('employee_update', {

        Uid: user.Uid,
        employee_name: user.Name,
        mobile_number: user.mobile_number,
        alternate_mb_no: user.alternate_mobile_number,
        email_id: user.Email,
        DOB: user.DOB,
        address: user.Address,
        password: user.Password
      })
    }
    else {
      req.flash('error', 'Employee not found with id = ' + req.params.id)
      res.redirect('employee')
    }
  })
})

// 5. Router to update employee 

router.post('/employee_update/:id', function (req, res, next) {
  var user_update = {
    Uid: req.body.Uid,
    Name: req.body.employee_name,
    Mobile_number: req.body.mobile_number,
    alternate_mobile_number: req.body.alternate_mb_no,
    Email: req.body.email_id,
    DOB: req.body.DOB,
    Address: req.body.address,
    Password: req.body.password
  }
  knex('employee').update(user_update).where('Uid', req.params.id).then(result => {
    console.log('employee_result = ', result);
    res.redirect('/users/employee')

  })
})

// 6. Router to delete employee 

router.get('/employee_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)
  {
    knex('employee').where('Uid', user.id).del()
      .then(() => {
        res.redirect('/users/employee');
      })
  }
})

// ---------------------------------------------Vendor-----------------------------------------------

// 1. Router for fetching data to table 

router.get('/vendor', function (req, res, next) {
  knex('vendor').select('*').then(result => {
    console.log('result=', result);
    res.render('vendor', { title: 'Laxmi Graphics', result: result });   
  })
});

// 2. Router to fetch the add vendor form

router.get('/add_vendor', function (req, res, next) {
  res.render('vendor_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added vendor info at database

router.post('/add_vendor', function (req, res, next) {
  const Company = req.body.Company;
  const VAT_number = req.body.VAT_number;
  const Phone = req.body.Mobile_number;
  const Website = req.body.Website;
  const Address = req.body.Address;
  const City = req.body.City;
  const State = req.body.State;
  const Zip_code = req.body.Zip_code;
  var user_info = {
    Company: Company,
    VAT_number: VAT_number,
    Phone: Phone,
    Website: Website,
    Address: Address,
    City: City,
    State: State,
    Zip_code: Zip_code
  }
  knex('vendor').insert(user_info)
    .then(result => {
      console.log("result=", result);
      res.redirect("vendor")

    })
})

// 4. Router to edit vendor 

router.get('/edit_vendor/:id', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('edit_user = ', user.id);
  knex('vendor').select('*').where('Uid', user.id).first().then(user => {
    console.log('user=', user.Company);
    if (user) {
      res.render('vendor_update', {

        Uid: user.Uid,
        Company: user.Company,
        VAT_number: user.VAT_number,
        Mobile_number: user.Phone,
        Website: user.Website,
        Address: user.Address,
        City: user.City,
        State: user.State,
        Zip_code: user.Zip_code
      })
    }
    else {
      req.flash('error', 'Vendor not found with id = ' + req.params.id)
      res.redirect('vendor')
    }
  })
})

// 5. Router to update vendor 

router.post('/vendor_update/:id', function (req, res, next) {
  var user_update = {
    Company: req.body.Company,
    VAT_number: req.body.VAT_number,
    Phone: req.body.Mobile_number,
    Website: req.body.Website,
    Address: req.body.Address,
    City: req.body.City,
    State: req.body.State,
    Zip_code: req.body.Zip_code
  }
  knex('vendor').update(user_update).where('Uid', req.params.id).then(result => {
    console.log('result = ', result);
    res.redirect('/users/vendor')
  })
})

// 6. Router to delete vendor 

router.get('/vendor_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)
  {
    knex('vendor').where('Uid', user.id).del()
      .then(() => {
        res.redirect('/users/vendor');
      })
  }
})

module.exports = router;
