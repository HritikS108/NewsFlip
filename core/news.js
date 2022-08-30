const NewsAPI = require('newsapi');
const settings = require("../settings");
const newsApiKey = settings.newsapi.key;
const newsapi = new NewsAPI(newsApiKey)

module.exports = {
    newsapi
};