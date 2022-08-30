const express = require("express");
const bodyParser = require("body-parser");
const MUUID = require('uuid-mongodb');

const {isLoggedIn} = require("../core/login");
const {newsapi} = require("../core/news");
const users = require("../data/users");
const sessions = require("../data/sessions");

const router = express.Router();

// Body-parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());


// home page
router.get("/", async (request, response) => {
    if (isLoggedIn(request)) {
        response.redirect(`/${request.session.user.username}/`);
    } else {
        response.render("home", {layout: 'home'})
    }
});

// signup service
router.post("/signup", async (request, response) => {
    try {
        request.session.user = await users.addUser(request.body);
        request.session.userID = MUUID.from(request.session.user._id).toString();
        await sessions.addSession(request.sessionID, request.session.userID);
        response.redirect(`/${request.session.user.username}/`);
    } catch (e) {
        response.setHeader('content-type', 'application/json');
        response.status(e.http_code).send(e.message)
    }
});

// login service
router.post("/login", async (request, response) => {
    try {
        if (isLoggedIn(request)) 
        {
            console.log("login ho rha");
            response.redirect(`/${request.session.user.username}/`);
        }
        console.log(1)

        const user = await users.isAuthenticated(request.body['username'], request.body['password']);
        console.log(2)
        if (user) 
        {
            await sessions.addSession(request.sessionID, user._id);
            console.log(3)
            request.session.userID = MUUID.from(user._id).toString();
            console.log(4)
            request.session.user = user;
            console.log(5)

            response.redirect(`/${user.username}/feed`);
            console.log(6)
        }
    } catch (e) {
        
        console.log("Bhosle");
        response.status(e.http_code).render("home", Object.assign({layout: "home"}, JSON.parse(e.message)))
    }
});

// logout web api
router.get('/logout', async function (request, response) {
    await sessions.endSession(request.sessionID);
    request.session.destroy(function (err) {
        response.redirect("/")
    })
});

// sources web api
router.get("/sources", async (request, response) => {
    try {
        newsapi.sources({
            language: 'en',
            country: 'us'
        }).then(res => {
            response.send(res)
        })
    } catch (e) {
        console.log(e)
    }
});

// categories web api
router.get("/categories", async (request, response) => {
    response.send([
        "business",
        "entertainment",
        "general",
        "health",
        "science",
        "sports",
        "technology"
    ])
});

// username check web api
router.post("/username", async (request, response) => {
    const username = request.body['username'];
    if (username && await users.usernameAvailable(username)) {
        response.send({'valid': true})
    } else {
        response.send({'valid': false})
    }
});

module.exports = router;