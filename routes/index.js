var express = require('express');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(app, passport){

  /* GET login page. */
  app.get('/login', function(req, res) {
      // Display the Login page with any flash message, if any
    res.render('login.jade', { message: req.flash('message') });
  });

  /* Handle Login POST */
  app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash : true
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/home');
  });

  /* GET Registration Page */
  app.get('/signup', function(req, res){
    res.render('register.jade',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  app.post('/signup', 
    passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }),
    function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/home');
  });

  /* GET Home Page */
  app.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });

  /* Handle Logout */
  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return app;
}




