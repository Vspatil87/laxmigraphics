var express = require('express');
var router = express.Router();
const knex = require('../knex_files');
var dateFormat = require("dateformat");
var cors = require('cors');

const { select, join, userParams, as } = require('../knex_files');
const { max } = require('moment');
const { query } = require('express');

router.use(cors());

// -----------------------------------------------Displaying the role table----------------------------------------------------------
router.get('/roles', function (req, res, next) {
    knex('roles').select('*').then(result => {
        res.render('roles', { result: result, title: "Laxmi Graphics" });
    })
})

// 2. Router to fetch the add role form 

router.get('/add_roles', function (req, res, next) {
    res.render('roles_add', { title: 'Laxmi Graphics' });
});

// 3. Router to post the added role info at database

router.post('/add_roles', function (req, res, next) {
    console.log('person name = ', req.body.person_name);
    var role_info = {
        person_name: req.body.person_name,
        person_role: req.body.person_role
    }
    knex('roles').insert(role_info)
        .then(result => {
            console.log("result=", result);
            res.redirect('roles')
        })
})

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
                person_role: user.person_role
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
        person_role: req.body.person_role
    }
    knex('roles').update(role_update).where('role_id', req.params.id).then(result => {
        res.redirect('/roles/roles')
    })
})


module.exports = router;