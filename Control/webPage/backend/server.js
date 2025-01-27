var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv').config()
var port = process.env.PORT || 5000;
var logger = require('morgan');
var influx = require("@influxdata/influxdb-client")
var app = express();
var apiRoutes = require("./routes/apiRoutes")
var {setCommands,getCommands} = require('./controllers/commandController')
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use("/api",apiRoutes)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  if(err.status == 404){
    res.json({Message: "URL not found"});}
  else{
    res.json({Message: "Server error"})
  }
});
influx.createData
app.listen(port,()=> console.log(`Server listening on ${port}`));