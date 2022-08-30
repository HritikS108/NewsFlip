const sessions = require("../data/sessions");

const isLoggedIn = function (request) {

    // console.log("A");
    // console.log(request.sessions.user);
    // console.log(request.sessionID);
    // console.log("B");

    return !!(request.session.user && sessions.isSessionValid(request.sessionID));
};

module.exports = {
  isLoggedIn
};