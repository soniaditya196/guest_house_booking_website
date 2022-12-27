const express=require('express');
const {isAuthenticated,isNotAuthenticated}=require("../middleware/authenticate");

const router=express.Router();

router.get("/",(req,res)=>{
    if(req.app.locals.values){
        delete req.app.locals.values;
    }
    res.render("portal",{pageTitle:"NITS Guest House",pageName:"portal"});
});

module.exports=router;