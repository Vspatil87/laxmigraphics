var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');
const { hash } = require('bcryptjs');

router.use(cors());

// -----------------------------------------------Displaying the role table----------------------------------------------------------
router.get('/roles', async (req, res, next) => {
    knex('roles').select('*').then(result => {
        // var arr = [];
        // for (var i = 0; i < result.length; i++) {
        //     var pass = result[i].person_password
        //     var password = {}
        //     password['pass'] = pass;
        //     arr.push(password);
        //     bcrypt.compare(arr, hash).then(function (result) {
        //     });
        // }
        res.render('roles', { result: result, title: "Laxmi Graphics" });
        // console.log('password = ', arr);
    })
})

// 2. Router to fetch the add role form 

router.get('/add_roles', function (req, res, next) {
    res.render('roles_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added role info at database

router.post('/add_roles', async (req, res, next) => {
    console.log('person name = ', req.body.person_name);
    // bcrypt.hash(req.body.person_password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    var role_info = {
        user_name: req.body.user_name,
        person_role: req.body.person_role,
        person_password: req.body.person_password,
    }
    console.log("hash = ", hash);
    knex('roles').insert(role_info)
        .then(result => {
            console.log("result=", result);
            res.redirect('roles')
        })
    // });
});


// })

// 4. Router to delete role 

router.get('/roles_delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id };
    console.log('user = ', user.id)
    {
        knex('roles').where('role_id', user.id).del()
            .then(() => {
                res.redirect('/roles/roles');
            })
    }
})

// 5. Router to edit role 

router.get('/edit_roles/:id', function (req, res, next) {
    knex('roles').select('*').where('role_id', req.params.id).first().then(user => {
        if (user) {
            res.render('roles_update', {
                role_id: user.role_id,
                person_name: user.person_name,
                person_role: user.person_role,
                person_password: user.person_password
            })
        }
        else {
            req.flash('error', 'Role not found with id = ' + user.id)
            res.redirect('roles')
        }
    })
})

// 6. Router to update role 

router.post('/roles_update/:id', function (req, res, next) {

    var role_update = {
        person_name: req.body.person_name,
        person_role: req.body.person_role,
        person_password: req.body.person_password
    }
    knex('roles').update(role_update).where('role_id', req.params.id).then(result => {
        res.redirect('/roles/roles')
    })
})

router.get('/define', function (req, res, next) {
    knex('roles').select('*').then(roles => {
        res.render("define_roles", { roles: roles, title: "Laxmi Graphics" })
    })
})

module.exports = router;