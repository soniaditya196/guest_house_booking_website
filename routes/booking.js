const express=require('express');
const Joi = require('joi');
const passport = require('passport');
const randomstring = require('randomstring');
const config = require("../config/keys");

const User = require("../models/user");

const mailgun = require('mailgun-js');
const DOMAIN = 'sandboxf2a885e58ea94c34b7457bf0d8e3137d.mailgun.org';
const api_key = '6c00ac2ff83a963a41971c8c28caf692-a2b91229-0f1a030e';
const mg = mailgun({apiKey:api_key, domain: DOMAIN});



const {isAuthenticated,isNotAuthenticated}=require("../middleware/authenticate");

const router=express.Router();

const userSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	username: Joi.string().required(),
	password: Joi.string().required(),
	confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
	phoneNumber: Joi.string().required()
});



router.route('/register').get(isNotAuthenticated,(req,res)=>{
    res.render("register",{pageTitle:"NITS Guest House",pageName:"register"});
});


router.post('/register', async (req, res, next) => {
    try {
        const result = Joi.validate(req.body, userSchema);
        if (result.error) {
            console.log(result.error)
            req.flash('error', 'Data is not valid. Please try again.');
            res.redirect('/booking/register');
            return;
        }
        // Checking if email is already taken
        const user = await User.findOne({ 'email': result.value.email });
        if (user) {
            req.flash('error', 'Email is already in use.');
            res.redirect('/booking/register');
            return;
        }
        // Hash the password
        const hash = await User.hashPassword(result.value.password);
        // Generate secret token
        const secretToken = randomstring.generate();
        // Save secret token to the DB
        result.value.secretToken = secretToken;
        // Flag account as inactive
        result.value.active = false;
        // Save user to DB
        delete result.value.confirmationPassword;
        result.value.password = hash;
        const newUser = await new User(result.value);
        // Compose email
        const html = `Hi there,
        Thank you for booking!
        Please verify your email by going to the following link!
        On the following page:
        "${config.baseURL}/booking/verify?secretToken=${secretToken}">NIT verify email
        Have a pleasant day.`;
        // Send email
        const data = {
            from : 'soniadityanits@gmail.com',
            to : result.value.email,
            subject : 'Guest House Verification',
            text : html
        };

        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
        console.log(`${config.baseURL}/booking/verify?secretToken=${secretToken}`);
        await newUser.save();
        req.flash('success', 'Please check your email for the verification code.');
        res.redirect('/booking/register');
    } catch (error) {
        next(error);
    }
});




router.get('/login',isNotAuthenticated,(req,res)=>{
    res.render("login",{pageTitle:"NITS Guest House",pageName:"login"});
});


router.post('/login', isNotAuthenticated, (req, res, next) => {
	passport.authenticate('local-user', function (err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			req.flash('error', info.message);
			return req.body.modal ? res.json({success: false, message: info.message}) : res.redirect('/booking/login'); 
		}
		req.logIn(user, function (err) {
			
			if (err) { 
				return next(err); 
			}
			
			const returnTo = req.session.returnTo ? req.session.returnTo : '/portal';
			delete req.session.returnTo;
			return req.body.modal ? res.json({
				success: true,
				redirect: returnTo
			}) : res.redirect(returnTo);
		});
	})(req, res, next);
});




router.get('/verify', async (req, res, next) => {
    try {
        const { secretToken } = req.query;
        var user = await User.findOne({ 'secretToken': secretToken });
        if (!user) {
            return next(new Error("User Not Found!"));
        }
        if (user.active === true) {
            req.flash('success', 'User account already activated!');
        }
        user.active = true;
        delete user.secretToken;
        await user.save();
        req.flash("success", "Your account has been successfully verified. You can now login!");
        res.redirect("/booking/login");
        
    } catch (error) {
        next(error);
    }
})

router.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out. Hope to see you soon!');
    res.redirect('/');
});


module.exports=router;

