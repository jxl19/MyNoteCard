'use strict';
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config.js');
const notecardRouter = require('./routers/notecardRouter');

app.use(express.static('public'));

app.use('/notecards', notecardRouter); 
// app.get('/tests', dirname html testpage); 
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
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
