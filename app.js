if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}



const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./modules/listing");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const { title } = require("process");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require('./utils/ExpressError.js');

const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./modules/review");
const session =  require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =  require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");







const listingRouter = require("./routes/listing.js");
const reviewRouter =  require("./routes/review.js");
const userRouter =  require("./routes/user.js");
const { cookie } = require("express-validator");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLAS_URL;
//   const dbUrl = "mongodb://127.0.0.1:27017/wanderlust"

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in store",err);
})
const optionSession = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}











async function main() {
    try {
        await mongoose.connect(dbUrl); 
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}
main();


main().then((res)=>{
    console.log("its was work");
}).catch((err)=>{
    console.log(err);
})

app.use(session(optionSession));
app.use(flash());

//passpost;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/demo",async (req,res)=>{
    let fakeUser = new User({
        email:"Student@gmail.com",
        username:"Jayakrishna"
    });
    let registeredUser = await User.register(fakeUser,"helloWorld");
    res.send(registeredUser);
})





app.use((req, res, next) => {
    res.locals.searchQuery = req.query.q || "";
    res.locals.placeType = req.query.placeType || "all";
    next();
});

app.get("/new",(req,res)=>{
    res.render("listings/new");
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/listings", async (req, res) => {
    const { q, placeType } = req.query;
    let filter = {};

    if (placeType && placeType !== 'all') {
        filter.placeType = placeType;
    }

    if (q) {
        filter.title = { $regex: q, $options: 'i' }; // case-insensitive search
    }

    const listings = await Listing.find(filter);
    res.render("listings/index", { listings, placeType: placeType || "all", searchQuery: q || "" });
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/search", async (req, res) => {
    const { q } = req.query;
    const regex = new RegExp(q, 'i'); // Case-insensitive search
    const listings = await Listing.find({ title: regex }).limit(5); // You can adjust limit
    res.json(listings);
});



//page not found
app.all(/.*/,(req,res,next)=>{
    next(new expressError(404,"page not found "));
});

// error handling
app.use((err,req,res,next)=>{
    let {statuscode = 500, message = "Something Went wrong!"} = err;
    // res.status(statuscode).send(message);
    // console.log(err);
    
    res.render("listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Loading krishna");
})
