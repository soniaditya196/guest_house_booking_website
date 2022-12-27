const express=require('express');
const {isAuthenticated,isNotAuthenticated}=require("../middleware/authenticate");

const router=express.Router();

router.get('/',(req,res)=>{
    res.render("about",{pageTitle:"NITS Guest House",pageName:"about"});
});

module.exports=router;
