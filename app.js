var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var fs = require("fs");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.get('/employeeRead',function(req,res){

fs.readFile('./Employee.json',function(err,data){
      console.log('***************', err, data);
      data = JSON.parse(data);
      console.log('*********************',data);
    res.end(JSON.stringify(data));
  
  });
});

app.post('/employeeCreate',function(req,res){
	res.writeHead(200,{'Content-Type':'text/html'});
    console.log("Going to write into existing file");
  fs.readFile('./Employee.json', function (err, data) {
	  var dat = JSON.parse(req.body);
      if (err) {
         return console.error(err);
      } 
     data = JSON.parse(data);
	  data.Employee.push(dat);
	  console.log(data);
	  
  fs.writeFile('./Employee.json',JSON.stringify(data) ,  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log(data);
   //console.log("Let's read newly written data");
     });
  }); 
   res.end('successful');
});

app.post('/visitorData',function(req,res){
	res.writeHead(200,{'Content-Type':'text/html'});
    console.log("Going to write into existing file");
  fs.readFile('./Employee.json', function (err, data) {
	  var dat = JSON.parse(req.body);
      if (err) {
         return console.error(err);
      } 
     data = JSON.parse(data);
	 for(i=0;i<data.length;i++){
		 if(data[i].id == dat.id)
			 data[i].mode = dat.mode;
		     data[i].vehicleNo = dat.vehicleNo;
	 }
	 console.log(data);	  
	  
  fs.writeFile('./Employee.json',JSON.stringify(data) ,  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log(data);

     });
  }); 
   res.end('successful');
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
