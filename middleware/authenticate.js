const isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo=req.originalUrl;
    req.flash("error", "Sorry, you must login first!");
    res.redirect("/booking/login");
};



const isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash("error", "Sorry, you are already logged in!");
      res.redirect("/portal");
    } else {
      return next();
    }
  };

  module.exports={isAuthenticated,isNotAuthenticated};