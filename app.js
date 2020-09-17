const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')


//db config

const db = require('./config/keys').mongoURI;

// passport config
require('./config/passport')(passport);

//connect to mongo

mongoose.connect(db, { useUnifiedTopology: true , useNewUrlParser: true })
.then(()=> console.log('mongo connectd'))
.catch(err=> console.log(err));

//bodyparser
app.use(express.urlencoded({extended:false}));

//middlewares
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

app.use(passport.initialize());
app.use(passport.session());

  app.use(flash());

app.use((req,res,next) =>{

    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.error = req.flash('error')
    next();
});


//ejs

app.use(expressLayouts);
app.set('view engine', 'ejs');



//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));

app.listen(PORT,console.log('server started on port ' + PORT));