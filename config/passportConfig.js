
const validPassword = require("../lib/passwordUtils").validPassword;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries").queries;

const verifyCallback = async(username, password, done) => {
    console.log('verify callback is being called with username: ', username, ' and password: ', password);
    const user = await db.getUserByUsername(username);
    console.log('user is: ', user);

    if (!user) { 
        return done(null,false) // null indicates NO error, and false indicates authentication has failed
    };

    const isValid = await validPassword(password,user.hash);
    console.log('validity is equal to: ',isValid);
    if (isValid) {
        console.log('it is valid and we are returning the user,', user);
        return done(null, user); // no error, returns user
    } else {
        return done(null, false); // no error, but authentication failed
    }
};

// INITIALISE STRATEGY
const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

// SERIALISE / DESERIALISE USER
passport.serializeUser((user,done)=>{
    done(null, user.user_id); // store user id information
});

passport.deserializeUser(async (userId, done)=>{
    try {
        const user = await db.getUserById(userId);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
