const express = require("express");
const moment = require('moment');  //used to do some time related operations
const bodyParser = require("body-parser");
const MUUID = require("uuid-mongodb");

const {isLoggedIn} = require("../core/login");
const {newsapi} = require("../core/news");
const users = require("../data/users");
const news = require("../data/news");
const sessions = require("../data/sessions");
const userNews = require("../data/userNews");


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

// user home page
router.get("/", async (request, response) => {
    try {
        if (isLoggedIn(request)) {

            newsapi.sources({
                language: 'en',
                country: 'us'
            }).then(res => {
                let sources = res.sources.map(function (source) {
                    return {
                        id: source.id,
                        text: source.name
                    }
                });

                response.render("user", {
                    user: request.session.user,
                    sources: sources,
                    sourcesSelected: JSON.stringify(request.session.user.sources.map(function (s) {
                        const source = sources.filter((x) => (x.id === s))[0];
                        return {
                            id: source.id,
                            text: source.text
                        }
                    })),
                    layout: 'user',
                    url: {
                        profile: `/${request.session.user.username}/`,
                        feed: `/${request.session.user.username}/feed`,
                        likes: `/${request.session.user.username}/likes`,
                        sessions: `/${request.session.user.username}/sessions`,
                        shared: `/${request.session.user.username}/shared`,
                        search: `/${request.session.user.username}/search`
                    }
                })
            });
        } else {
            response.redirect("/")
        }
    } catch (e) {
        response.status(500);
        response.render("error", {title: "Error"})
    }
});

router.post("/", async (request, response) => {
    try {
        if (request.body["sources"]) {
            request.session.user = await users.updateUser(request.session.userID, request.body["sources"], true);
        } else {
            request.session.user = await users.updateUser(request.session.userID, request.body);
        }
        response.redirect(`/${request.session.user.username}/feed`)
    } catch (e) {
        response.status(e.http_code).send(e.message);
    }
});


// user feeds
router.get("/feed", async (request, response) => {
    try {
        newsapi.v2.topHeadlines({
            sources: request.session.user.sources.join()
        }).then(res => {
            news.addNewsList(res["articles"]).then(newsList => {
                    response.render("feed", {
                        news: newsList.map(function (article) {
                            article.id = MUUID.from(article._id).toString();
                            article.from = moment.duration(moment(article.publishedAt) - moment.now()).humanize(true);
                            article.likes = article.likedBy.length;
                            article.dislikes = article.dislikedBy.length;
                            article.isLiked = true;
                            return article
                        }),
                        layout: 'user',
                        url: {
                            profile: `/${request.session.user.username}/`,
                            feed: `/${request.session.user.username}/feed`,
                            likes: `/${request.session.user.username}/likes`,
                            sessions: `/${request.session.user.username}/sessions`,
                            shared: `/${request.session.user.username}/shared`,
                            search: `/${request.session.user.username}/search`
                        }
                    })
                }
            );
        });
    } catch (e) {
        console.log(e)
    }
});

// user sessions
router.get("/sessions", async (request, response) => {
    let sessionsList = await sessions.getSessionByUserId(request.session.userID);
    sessionsList = sessionsList.map(function (session) {
        if (!session.isActive) {
            session.duration = moment.duration(session.endTime - session.startTime).humanize()
        } else {
            session.duration = moment.duration(session.startTime - new Date()).humanize(true)
        }
        return session;
    });
    response.render("sessions", {
        sessions: sessionsList,
        layout: 'user',
        url: {
            profile: `/${request.session.user.username}/`,
            feed: `/${request.session.user.username}/feed`,
            likes: `/${request.session.user.username}/likes`,
            sessions: `/${request.session.user.username}/sessions`,
            shared: `/${request.session.user.username}/shared`,
            search: `/${request.session.user.username}/search`
        }
    })
});

// user liked and disliked news
router.get("/likes", async (request, response) => {
    const likes = await users.getLiked(request.session.userID);
    response.render("likes", {
        likes: likes,
        layout: 'user',
        url: {
            profile: `/${request.session.user.username}/`,
            feed: `/${request.session.user.username}/feed`,
            likes: `/${request.session.user.username}/likes`,
            sessions: `/${request.session.user.username}/sessions`,
            shared: `/${request.session.user.username}/shared`,
            search: `/${request.session.user.username}/search`
        }
    })
});

// user shared news
router.get("/shared", async (request, response) => {
    const shared = await users.getShared(request.session.userID);
    response.render("shared", {
        shared: shared,
        layout: 'user',
        url: {
            profile: `/${request.session.user.username}/`,
            feed: `/${request.session.user.username}/feed`,
            likes: `/${request.session.user.username}/likes`,
            sessions: `/${request.session.user.username}/sessions`,
            shared: `/${request.session.user.username}/shared`,
            search: `/${request.session.user.username}/search`
        }
    })
});

// like news web api
router.post("/like", async (request, response) => {
    try {
        await userNews.likeNews(request.session.userID, request.param("newsId"));
    } catch (e) {
        response.status(e.http_code).send(e)
    }
});

// dislike news web api
router.post("/dislike", async (request, response) => {
    try {
        await userNews.dislikeNews(request.session.userID, request.param("newsId"));
    } catch (e) {
        response.status(e.http_code).send(e)
    }
});

// share news web api
router.post("/share", async (request, response) => {
    try {
        await userNews.shareNews(request.session.userID, request.param("receiverIds"), request.param("newsId"));
    } catch (e) {
        response.status(e.http_code).send(e)
    }
});

// search news page
router.post("/search", async (request, response) => {
    try {
        newsapi.v2.topHeadlines({
            q: request.body['keywords']
        }).then(res => {
            response.render("feed", {
                news: res["articles"].map(function (article) {
                    article.from = moment.duration(moment(article.publishedAt) - moment.now()).humanize(true)
                    return article
                }),
                layout: 'user',
                url: {
                    profile: `/${request.session.user.username}/`,
                    feed: `/${request.session.user.username}/feed`,
                    likes: `/${request.session.user.username}/likes`,
                    sessions: `/${request.session.user.username}/sessions`,
                    shared: `/${request.session.user.username}/shared`,
                    search: `/${request.session.user.username}/search`
                }
            })
        });
    } catch (e) {
        console.log(e)
    }
});

// search news page
router.post("/search", async (request, response) => {
    const news = [];
    response.render("search", {
        news: news,
        layout: 'user',
        url: {
            profile: `/${request.session.user.username}/`,
            feed: `/${request.session.user.username}/feed`,
            likes: `/${request.session.user.username}/likes`,
            sessions: `/${request.session.user.username}/sessions`,
            shared: `/${request.session.user.username}/shared`,
            search: `/${request.session.user.username}/search`
        }
    })
});


module.exports = router;