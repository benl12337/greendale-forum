const { Router } = require("express");
const indexRouter = Router();
const users = require("../controllers/users");

// POST ROUTES
indexRouter.post('/register', users.registerPost);
indexRouter.post('/login', users.loginPost);
indexRouter.post('/create-post', users.createPostPost);
indexRouter.post('/membership', users.membershipPost);
indexRouter.post("/demote", users.demotePut);

// GET ROUTES   
indexRouter.get("/", users.indexGet);
indexRouter.get("/users/:userId", users.profileGet);
indexRouter.get("/register", users.registerGet);
indexRouter.get("/login", users.loginGet);
indexRouter.get("/membership", users.membershipGet)
indexRouter.get("/create-post", users.createPostGet);
indexRouter.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
});


module.exports = indexRouter;