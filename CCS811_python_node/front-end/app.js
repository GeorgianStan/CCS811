// BASE SETUP
// ==============================================
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app)
  const io = require('socket.io')(server)

  const mongoose = require('mongoose')

  const path = require('path')
  const hbs = require('express-handlebars'); //require hbs for template engine
  const bodyParser = require('body-parser'); //parse request

  const port = process.env.PORT || 8080 //app port

  const index = require('./routes/index.js') //routes



  const Db = require('mongodb').Db,
        MongoClient = require('mongodb').MongoClient;

  let db
// database setup
// ==============================================
  MongoClient.connect("mongodb://interface:interface@ds259305.mlab.com:59305/ccs811", {native_parser:true}, function(err, database) {
    if(err) throw err
    console.log('Connection has been made to mLab')
    db = database;
      const socket = require('./socket/socket.js')(io,db) //socket
    //Start the application after the database connection is ready
    //===================================
      server.listen(port,function(req){
        console.log('app is up at port ' , port)
      });

  })



// VIEW ENGINE
// ==============================================
  app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');


// app setup
// ==============================================
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));


// routes setup
// ==============================================
  app.use('/',index);
