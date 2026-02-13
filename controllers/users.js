const User = require ("../models/user");


     //renderSignupForm
module.exports.renderSignupForm = (req,res)=>{
  res.render("users/signup.ejs");
};

    // signup routes
module.exports.signup =async (req,res) => {
    try{
    let {username , email, password } = req.body;
    const newUser = new User ({email, username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login (registerUser,(err)=>{
      if(err) {
        return next (err);
      }
    req.flash ("success", "welcome to wanderlust !")
    res.redirect("/listings")
    }) ;
    }
    catch(e) {
       req.flash("error", e.message);
       res.redirect("/signup")
    }
  };

     // renderLoginForm
module.exports.renderLoginForm = (req,res)=>{
     res.render("users/login.ejs")
  };

     // login
module.exports.login = async (req,res)=>{
     req.flash("success","Welcome back to Wanderlust !");  // password authetication automatic passowd wrong msg deta
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);  
  }

     // logout
module.exports.logout = (req,res,next)=>{     // log outs routes //
     req.logout((err)=>{
        if(err){
        return next (err);
        }
        req.flash("success", "you are logged out ! ");
        res.redirect("/listings");
     })
  }