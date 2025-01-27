require('dotenv').config(); // load in environment variables

// required modules
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const db = require('./db/queries');
const routes = require("./routes/index");
const path = require("node:path");


// Require the passport config module
require("./config/passportConfig");

const app = express(); // create the express application

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Settings paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(session({
    store: new pgSession({
        pool: db.connection, // use the exsting pool connection
    }),
    secret: 'cats',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.session());

// APP ROUTES
app.use((req,res,next)=>{
    console.log('the user is: ',req.user);
    next();
});
app.use(routes);

// SERVER
app.listen(3000, ()=>console.log('Server is running'));
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

console.log('the users current date time is', timezone);

