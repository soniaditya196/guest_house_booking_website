const express=require("express");
const morgan=require("morgan");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const compression=require("compression");
const flash=require("connect-flash");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const mongoose=require("mongoose");
const passport=require("passport");
const path=require("path");
const router=require("./routes");
const config=require("./config/keys");
require("./authentication/passport");

const PORT=process.env.PORT||8080;

const app=express();

app.use(morgan("dev"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(compression());

app.use(express.static(path.join(__dirname,"public")));
app.use("/images",express.static(path.join(__dirname,"images")));

mongoose.connect(config.database,{useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true});
let db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('Connected to database');
});

app.use(
    session({
        store:new MongoStore({
            mongooseConnection:db,
            touchAfter:24*3600,
            clear_interval:3600
        }),
        secret:config.sessionSecret,
        saveUninitialized:false,
        resave:false,
        cookie:{maxAge:24*60*60*1000}
    })
);




app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.user=req.user;
    res.locals.isAuthenticated=req.user?true:false;
    res.locals.role=req.user?req.user.role:null;
    next();
});


app.use('/',router);

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}....`);
})