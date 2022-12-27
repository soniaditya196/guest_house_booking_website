const express=require('express');
const {isAuthenticated,isNotAuthenticated}=require("../middleware/authenticate");

const router=express.Router();

router.get('/',(req,res)=>{
    res.render("accomodation",{pageTitle:"NITS Guest House",pageName:"accomodation"});
});

module.exports=router;