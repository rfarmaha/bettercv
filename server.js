// server.js

// modules =================================================
var express        = require('express');
var multer		   = require('multer');
var app            = express();
var done 		   = false;
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fs 			   = require('fs');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy

// configuration ===========================================
    
// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 5000; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser()); 
app.use(cookieParser());

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

passport.use(new LocalStrategy(function(username, password, done) { 
  // insert your MongoDB check here. For now, just a simple hardcoded check.
  if (username === 'foo' && password === 'bar')
  {
    done(null, { user: username });
  }
  else
  {
    done(null, false);
  }
}));

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

/*Handling routes.*/

app.get('/',function(request ,response){
      res.sendfile("index.html");
});

app.post('/file-upload', function (request, response) {

  fs.readFile("usernameresume", function(err, data) {

    var newPath = "./public/data";
    fs.writeFile(newPath, data, function (err) {
      console.log("Finished writing file..." + err);
      response.redirect("back");
    });

  });

});

// routes ==================================================
require('./routes/index')(app, passport); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;