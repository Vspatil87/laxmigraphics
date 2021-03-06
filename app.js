var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productrouter = require('./routes/product');
var categoryrouter = require('./routes/category');
var inquiryrouter = require('./routes/inquiry');
var quotationrouter = require('./routes/quotation');
var invoicerouter = require('./routes/invoice');
var dcrouter = require('./routes/dc');
var dashboardrouter = require('./routes/dashboard');
var rolesrouter = require('./routes/roles');
var telecallerrouter = require('./routes/telecaller');
var receptionrouter = require('./routes/reception');
var operationmanagerrouter = require('./routes/omanager');
var accountsmanagerrouter = require('./routes/amanager');


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productrouter);
app.use('/category', categoryrouter);
app.use('/inquiry', inquiryrouter);
app.use('/quotation', quotationrouter);
app.use('/invoice', invoicerouter);
app.use('/dc', dcrouter);
app.use('/dashboard', dashboardrouter);
app.use('/roles', rolesrouter);
app.use('/telecaller', telecallerrouter);
app.use('/reception', receptionrouter);
app.use('/omanager', operationmanagerrouter);
app.use('/amanager', accountsmanagerrouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
