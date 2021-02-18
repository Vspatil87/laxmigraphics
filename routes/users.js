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

router.get('/customer', function (req, res, next) {
  knex('customer').select('*').then(result => {
    console.log('result=', result);
    res.render('customer', { title: 'Laxmi Graphics', result: result });  
  })
});

router.get('/add_customer', function (req, res, next) {
  res.render('customer_add', { title: 'Laxmi Graphics' });
});

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

router.get('/employee', function (req, res, next) {
  knex('employee').select('*').then(result => {
    console.log('result=', result);
    res.render('employee', { title: 'Laxmi Graphics', result: result });   
  })
});

router.get('/add_employee', function (req, res, next) {
  res.render('employee_add', { title: 'Laxmi Graphics' });
});

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

router.get('/vendor', function (req, res, next) {
  knex('vendor').select('*').then(result => {
    console.log('result=', result);
    res.render('vendor', { title: 'Laxmi Graphics', result: result });   
  })
});

router.get('/add_vendor', function (req, res, next) {
  res.render('vendor_add', { title: 'Laxmi Graphics' });
});

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


//------------------------------------------------category-----------------------------------------------

router.get('/category', function (req, res, next) {
  knex('category').select('*').then(result => {
    res.render('category', { title: 'Laxmi Graphics', result: result });
  })
})

router.get('/add_category', function (req, res, next) {
  res.render('category_add', { title: 'Laxmi Graphics' });
});

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


router.get('/category_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)
  {
    knex('category').where('Uid', user.id).del()
      .then(() => {
        res.redirect('/users/category');
      })
  }
})

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

router.post('/category_update/:id', function (req, res, next) {

  var user_update = {
    Name: req.body.Name
  }
  knex('category').update(user_update).where('Uid', req.params.id).then(result => {
    console.log('category_result = ', result);
    res.redirect('/users/category')

  })
})

// --------------------------------------------Sub Category---------------------------------------------------

router.get('/sub_category', function (req, res, next) {
  knex('sub_category').join('category', 'sub_category.main_category_id', '=', 'category.Uid')
    .select('sub_category.sub_cat_id', 'sub_category.main_category_id', 'category.Name', 'sub_category.sub_category')
    .then(cat => {
      console.log('cat', cat);
      res.render('sub_category', { title: 'Laxmi Graphics', cat: cat })
    })
})

router.get('/add_sub_category', function (req, res, next) {
  knex('category').select('*').then(sel => {
    console.log('result_of_selected_category=', sel);
    res.render('sub_category_add', { result: sel, title: 'Laxmi Graphics' });
  })
})

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
      res.redirect('/users/sub_category')
    })
  })
})


router.get('/sub_category_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)
  {
    knex('sub_category').where('sub_cat_id', user.id).del()
      .then(() => {
        res.redirect('/users/sub_category');
      })
  }
})


// ---------------------------------------------Products-------------------------------------------------

router.get('/product', function (req, res, next) {
  knex('product').join('sub_category', 'sub_category.sub_cat_id', '=', 'product.sub_category_id')
    .select('product.product_name', 'product.product_id', 'product.sub_category_id', 'sub_category.sub_category').then(result => {
      console.log('result=', result);
      res.render('product', { title: 'Laxmi Graphics', result: result });
    })
});

router.get('/add_product', function (req, res, next) {
  knex('sub_category').select('*').then(sub_category => {
    console.log('resultofselectedsubcategory = ', sub_category);
    res.render('product_add', { result: sub_category, title: 'Laxmi Graphics' });
  })
});

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
        res.redirect('/users/product')
      })
    })
})

router.get('/product_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('product_id = ', user.id)

  {
    knex('product').where('product_id', user.id).del()
      .then(() => {
        res.redirect('/users/product');
      })
  }
})

// --------------------------------------------Product Details--------------------------------------------

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

router.get('/add_product_details', function (req, res, next) {
  knex.select('*').from('category')
    .then(sel => {
      console.log('result_of_selected_category=', sel);
      res.render('product_details_add', { result: sel, title: 'Laxmi Graphics' });
    })
})

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

router.post('/select_category', function (req, res, next) {
  console.log('name=', req.body.name)
  knex('category')
    .join('sub_category', 'category.Uid', '=', 'sub_category.main_category_id')
    .select('sub_category').where('category.Name', req.body.name).then(sel => {
      res.json({ sel });
      console.log(sel);
    })
})

router.post('/select_product', function (req, res, next) {
  console.log('selected_product_name=', req.body.name)
  knex('sub_category')
    .join('product', 'sub_category.sub_cat_id', '=', 'product.sub_category_id')
    .select('product_name').where('sub_category.sub_category', req.body.name).then(product => {
      console.log('product = ', product);
      res.json({ product });
    })
})

router.get('/product_details_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('product_details_id = ', user.id)
  {
    knex('product_details').where('product_details_id', user.id).del()
      .then(() => {
        res.redirect('/users/product_details');
      })
  }
})

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
        req.flash('error', 'Customers not found with id = ' + req.params.id)
        res.redirect('customer')
      }
    })
})

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
          res.redirect('/users/product_details')
        })
      })
    })
  })
})

// ---------------------------------------------customer Inquiry--------------------------------------------------

router.get('/customer_inquiry', function (req, res, next) {
  knex('customer_inquiry').select('*').then(selected_customer => {
    console.log('result_of_customer_inquiry=', selected_customer);
    res.render('customer_inquiry', { result: selected_customer, title: 'Laxmi Graphics' });
  })
})


router.get('/add_customer_inquiry', function (req, res, next) {
  knex('customer').select('*').then(result => {
    res.render('customer_inquiry_add', { result: result, title: 'Laxmi Graphics' });
  })
});

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


router.get('/customer_inquiry_delete/(:id)', function (req, res, next) {
  var user = { id: req.params.id };
  console.log('user = ', user.id)

  {
    knex('customer_inquiry').where('customer_id', user.id).del()
      .then(() => {
        res.redirect('/users/customer_inquiry');
      })
  }
})

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
    res.redirect('/users/customer_inquiry')
  })
})



router.post('/customer_select', function (req, res, next) {
  var id = req.body.name;
  console.log('id = ', id);
  knex('customer').select('*').where('Customer_name', id).then((resultofcustomer) => {
    res.json({ resultofcustomer });
    console.log('resultofcustomer = ', resultofcustomer);
  })
})

// --------------------------------------------------Quotation---------------------------------------------------------

router.get('/quotation', function (req, res, next) {
  knex('quotation').limit('1').max('estimate_no as q').then(estimate_no => {
    knex('customer').select('*').then(result => {
      knex('product').select('*').then(product_name => {
        res.render('quotation', { product_name: product_name, estimate_no: estimate_no[0].q, result: result, title: 'Laxmi Graphics' });
      })
    })
  })
});

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

router.post('/select_company', function (req, res, next) {
  console.log('customer name =', req.body.name);
  knex('customer').select('*').where('Customer_name', req.body.name).then(company => {
    console.log('company = ', company);
    res.json({ company });
  })
});

router.post('/select_address', function (req, res, next) {
  console.log('name =', req.body.name);
  knex('customer').select('*').where('Company', req.body.name).then(address => {
    console.log('address = ', address);
    res.json({ address });
  })
});

router.post('/select_saddress', function (req, res, next) {
  console.log('name =', req.body.name);
  knex('customer').select('*').where('Company', req.body.name).then(address => {
    console.log('address = ', address);
    res.json({ address });
  })
});

router.post('/insert_quotation', function (req, res, next) {
  knex('customer').select('*').where('Company', req.body.Company)
    .then(customer => {
      var quotation = {
        customer: customer[0].Customer_name,
        company: req.body.Company,
        bill_address: customer[0].Address,
        bill_city: customer[0].City,
        bill_state: customer[0].State,
        bill_zip_code: customer[0].Zip_code,
        ship_address: customer[0].Address,
        ship_city: customer[0].City,
        ship_state: customer[0].State,
        ship_zip_code: customer[0].Zip_code,
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
        res.redirect('quotation');
      })
    })
})

// ---------------------------------------------------Invoice-----------------------------------------------------------

router.get('/invoice', function (req, res, next) {
  knex('invoice').limit('1').max('invoice_no as n').then(invoice => {
    console.log('invoice_no = ', invoice[0].n);
    knex('customer').select('*').then(result => {
      knex('product').select('*').then(product_name => {
        res.render('invoice', { product_name: product_name , invoice: invoice[0].n, result: result, title: 'Laxmi Graphics' });
      })
    })
  })
});

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

router.post('/invoice_select_company', function (req, res, next) {
  console.log('customer name =', req.body.name);
  knex('customer').select('*').where('Customer_name', req.body.name).then(company => {
    console.log('company = ', company);
    res.json({ company });
  })
});

router.post('/invoice_select_address', function (req, res, next) {
  console.log('name =', req.body.name);
  knex('customer').select('*').where('Company', req.body.name).then(address => {
    console.log('address = ', address);
    res.json({ address });
  })
});

router.post('/invoice_select_saddress', function (req, res, next) {
  console.log('name =', req.body.name);
  knex('customer').select('*').where('Company', req.body.name).then(address => {
    console.log('address = ', address);
    res.json({ address });
  })
});

router.post('/insert_invoice', function (req, res, next) {
  knex('customer').select('*').where('Company', req.body.Company)
    .then(customer => {
      var invoice = {
        customer: customer[0].Customer_name,
        company: req.body.Company,
        bill_address: customer[0].Address,
        bill_city: customer[0].City,
        bill_state: customer[0].State,
        bill_zip_code: customer[0].Zip_code,
        ship_address: customer[0].Address,
        ship_city: customer[0].City,
        ship_state: customer[0].State,
        ship_zip_code: customer[0].Zip_code,
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
        res.redirect('invoice');
      })
    })
})

module.exports = router;
