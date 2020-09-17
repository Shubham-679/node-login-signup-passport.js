const { request } = require("express");

module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_message','plz login to view this resource');
        res.redirect('users/login');
    }
}