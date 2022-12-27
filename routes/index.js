const express=require("express");
const {isAuthenticated}=require('../middleware/authenticate');

const homeRoutes=require('./home');
const accomodationRoutes=require('./accomodation');
const booking=require('./booking');
const about=require('./about');
const peopleRoutes=require('./people');
const portalRoutes=require('./portal');
const errorRoutes = require('./error');

const router=express.Router();

router.use("/",homeRoutes);
router.use("/accomodation",accomodationRoutes);
router.use("/booking",booking);
router.use("/about",about);
router.use("/people",peopleRoutes);
router.use("/portal",portalRoutes);
router.get("/500",errorRoutes);

router.use((req,res,next)=>{
    res.render('notFound',{pageName:'Not Found',pageTitle:'NITS Guest House'});
});

router.use((error,req,res,next)=>{
    console.error(error.stack);
    res.redirect("/500");
});

module.exports=router;