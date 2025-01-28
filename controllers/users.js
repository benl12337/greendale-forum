const genPassword = require("../lib/passwordUtils").genPassword;
const { formatDistance } = require("date-fns");
const { fromZonedTime } = require("date-fns-tz");
const ejs = require('ejs');

const db = require("../db/queries").queries;
const passport = require("passport");


const usersController = {

    // GET ROUTES
    indexGet: async (req, res, next) => {
        const messages = await db.getAllMessages();


        if (messages) {

            const formattedMessages = messages.map((message) => {
                const formattedDate = formatDistance(message.date, new Date(), { addSuffix: true });
                return { ...message, date: formattedDate }
            })

            res.render("layout", {
                bodyContent: 'pages/index.ejs',
                title: 'Greendale Forums',
                messages: formattedMessages,
                user: req.user
            });
        } else {
            res.send("No posts exist yet");
            }

    },

    profileGet: async(req, res, next) => {

        // get the user id of current profile
        const userId = req.params.userId;

        // get user object of current profile and their posts
        const currUser = await db.getUserById(userId);
        const userPosts = await db.getUserMessages(userId);

        // format the dates
        const formattedPosts = userPosts.map((post) => {
            const formattedDate = formatDistance(post.date, new Date(), { addSuffix: true });
            return { ...post, date: formattedDate }
        })

        // render the posts
        res.render("layout", { bodyContent: 'pages/profile.ejs', messages: formattedPosts, user: req.user, profile: currUser });
    },

    registerGet: async (req, res, next) => {
        res.render("layout", { bodyContent: 'pages/register.ejs', user: req.user });
    },

    createPostGet: async (req, res, next) => {
        res.render("layout", { bodyContent: 'pages/createPost.ejs', user: req.user })
    },

    membershipGet: async (req, res, next) => {
        res.render("layout", { bodyContent: 'pages/membership.ejs', user: req.user });
    },

    loginGet: (req, res, next) => {
        res.render("layout", { bodyContent: 'pages/login', user: req.user });
    },

    demotePut: async (req, res, next) => {
        const userId = req.user.user_id;
        await db.demoteUser(userId);
        res.redirect("/");
    },

    registerPost: async (req, res, next) => {

        // check if username exists, if it exists redirect to login
        const exists = await db.getUserByUsername(req.body.username);
        if (exists) {
            res.redirect("/register");
        } else {
            const hashedPassword = await genPassword(req.body.password); // generate the password hash
            await db.createUser(req.body.first_name, req.body.last_name, req.body.username, hashedPassword); // insert user into database
            res.redirect("/login");
        }
    },

    createPostPost: async (req, res, next) => {
        // insert the message content into the db
        try {
            await db.createPost(req.user.user_id, req.body.message);
        } catch (err) {
            console.log(err);
        }

        res.redirect("/");
    },

    membershipPost: async (req, res, next) => {
        if (req.body.profilePassword == 'craigpelton') {
            try {
                await db.upgradeUser(req.user.user_id);
                res.redirect("/membership");
            } catch (err) {
                console.log(err);
            }
        } else {
            res.redirect("/membership");
        }
    },

    loginPost: passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", }),
}

module.exports = usersController;