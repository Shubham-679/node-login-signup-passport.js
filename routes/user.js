const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login')
  })
 
  router.get('/register', (req, res) => {
    res.render('register')
  })

//register
router.post('/register', (req, res)=>{  
  const { name , email, password , password2 } = req.body;
  let errors = [];

  if(!name || !email || !password || !password2){
    errors.push({msg : 'plz enter all fields'});
    }
  if(password!==password2){
    errors.push({msg : 'password does not match'})
  }
  if (password.length<6){
  errors.push({msg:'password should be greater then 6 characters'})  
  }
  if (errors.length > 0) {
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else{
    //  validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
      bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password, salt, (err , hash)=>{
          if(err) throw err;
          // set password to hashed
          newUser.password = hash;
          //save user
          newUser.save()
          .then(user => {
            req.flash('success_message','you are now registerd and can login');
            res.redirect('/users/login');
          })
          .catch(err => console.log(err));
        })
      })
    }
    
     })    
  }
  console.log(req.body);
});

// login handle
 router.post('/login', (req, res,next)=>{
  passport.authenticate('local', {
  successRedirect:'/dashboard',
  failureRedirect:'/users/login',
  failureFlash:true
})(req,res,next);
 });

 //logout handle
 router.get('/logout',(req,res)=>{
   req.logout();
   req.flash('success_message','you are logged out');
   res.redirect('/users/login');
 });

  module.exports = router;