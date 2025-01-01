const User = require("../models/user.js");

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email , username});
        const registered = await User.register(newUser , password);
        req.login(registered,(error,next)=>{
            if(error){
              return next(error);
            }
            req.flash("success","Welocome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error","Invalid user");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  // Redirect after successful login
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      } 
      req.flash("success","Logged out");
      res.redirect("/listings");

    });
};
