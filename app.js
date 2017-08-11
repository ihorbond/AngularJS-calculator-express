const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
// const cors         = require('cors');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const layouts      = require('express-ejs-layouts');


const app = express();
// app.use(cors({
//   credentials: true,
//   origin: 'null'
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express Calculator';
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/app')));
app.use(layouts);
app.use(session({
  secret: 'secret-calculator',
  //do not force resave if no changes were made
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
  }
}));

//show memory
app.get('/memory', (req, res, next) => {
  if (req.session.memory) {
    res.json(req.session.memory);
  }
  res.json("0");
});

//add to memory
app.post('/mplus', (req, res, next) => {

   if (!req.session.memory) {
     req.session.memory = 0;
   }
   req.session.memory = parseFloat(req.body.data);
   res.json(`Added ${req.body.data} to memory`);
});

//substract from memory
app.patch('/mminus', (req, res, next) => {

  if (!req.session.memory) {
    req.session.memory = 0;
  }
  req.session.memory -= parseFloat(req.body.data);
  // console.log(sessionData.memory);
  res.json(`Substracted ${req.body.data} from memory`);
});

//erase data stored in memory
app.delete('/mc', (req, res, next) => {
  if(req.session.memory) {
    req.session.memory = 0;
  }
  // console.log(sessionData.memory);
  res.json("Erased");
});

//send to index.html if no route matched
app.use((req, res, next) => {
  res.sendFile(__dirname + '/public/app/index.html');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
