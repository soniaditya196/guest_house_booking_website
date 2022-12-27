const passport=require("passport");
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');

function SessionConstructor(userId,details){
    this.userId=userId;
    this.details=details;
}
passport.serializeUser((userObject,done)=>{
    let userPrototype=Object.getPrototypeOf(userObject);
    console.log('userPrototype: ',userPrototype);
    let sessionConstructor=new SessionConstructor(userObject.id,'');
    done(null,sessionConstructor);
});

passport.deserializeUser(async (sessionConstructor,done)=>{
        try{
            const user=await User.findById(sessionConstructor.userId);
            done(null,user);
        }catch(error){
            done(error,null);
        }
});

passport.use('local-user',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:false
}, async(email,password,done)=>{
    try{
        // 1) Check if the email already exists
        const user=await User.findOne({'email':email});
        if(!user){
            return done(null,false,{message:'Unknown User'});
        }
        // 2) Check if the password is correct
        const isValid=await User.comparePasswords(password,user.password);
        if (!isValid) {
			return done(null, false, { message: 'Incorrect Password' });
        }
        
		// 3) Check if email has been verified
		if (!user.active) {
			return done(null, false, { message: 'Sorry, you must validate email first' });
        }
        return done(null, user);
    }catch (error) {
		return done(error, false);
	}
}));


