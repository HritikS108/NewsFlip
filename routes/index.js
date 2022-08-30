const session = require('express-session');
const MUUID = require('uuid-mongodb');

const {isLoggedIn} = require("../core/login");
const rootRoutes = require("./root");
const userRoutes = require("./user");


const constructorMethod = app => {
    app.use(session({
        name: 'AuthCookie',
        secret: 'meetmetatthetogaparty',
        resave: false,
        saveUninitialized: true,
        genid: function (request) {
            return MUUID.v4().toString()
        }
    }));

    // logging middleware
    const logger = function (request, response, next) 
    {
        console.log(`[${new Date().toUTCString()}]: ${request.method}\t${request.originalUrl}\t\t${isLoggedIn(request) ? 'Authenticated' : 'Not Authenticated'}`);
        console.log("Ho GYA");
        next()
    };

    app.use(logger);

    app.use("/", rootRoutes);

    app.use("/:username", function (request, response, next) {
        if(isLoggedIn(request)) {
            next()
        } else {
            response.status(403);
            response.redirect("/")
        }
    });

    app.use("/:username", userRoutes);

    app.use("*", (request, response) => {
        if (isLoggedIn(request)) {
            response.redirect(`/${request.session.user.username}/feed`)
        } else {
            response.redirect("/");
        }
    });
};

module.exports = constructorMethod;
