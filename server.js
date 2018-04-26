const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();
const {PORT, DATABASE_URL} = require('./config.js');
const {User} = require('./models')
const userRouter = require('./routers/userRouter');
const notecardRouter = require('./routers/notecardRouter');
// const testRouter = require('./routers/testRouter');
const userController = require('./controllers/userController');
mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    url: DATABASE_URL,
    collection: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    console.log('no way jose');
    res.redirect('/');
  }
}
app.use('/users', userRouter);
app.use('/notecards', notecardRouter); 
// app.use('/test', testRouter);
app.use('/signup', (req, res) => {
  res.status(200).sendFile(__dirname + '/public/signup.html');
})
app.get('/notecard',ensureAuthenticated,(req, res) => {
  res.status(200).sendFile(__dirname + '/public/notecard.html');
});



app.get('/logout', userController.logout);

app.use('*', (req,res) => {
  res.status(404).json({message: 'Request not found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
        console.log(databaseUrl);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
