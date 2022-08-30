const MUUID = require('uuid-mongodb');
const uuidv3 = require('uuid/v3');

const collections = require("./collection");
const newsCollections = collections.news;

async function addNews(newNews) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newNews === undefined || newNews === null) {
        errors['news'] = "news object not defined";
        error.http_code = 400
    } else if (typeof newNews !== "object") {
        errors['news'] = "invalid type of news";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("source")) {
        errors['source'] = "missing property";
        error.http_code = 400
    }

    if (!(typeof newNews["source"] !== "object")) {
        errors['source'] = "invalid type";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("author")) {
        errors['author'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("title")) {
        errors['title'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("description")) {
        errors['description'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("url")) {
        errors['url'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("urlToImage")) {
        errors['urlToImage'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("publishedAt")) {
        errors['publishedAt'] = "missing property";
        error.http_code = 400
    }

    if (!newNews.hasOwnProperty("content")) {
        errors['content'] = "missing property";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    newNews._id = MUUID.from(uuidv3(newNews.url, uuidv3.URL));
    newNews.likedBy = [];
    newNews.dislikedBy = [];

    const newsCollection = await newsCollections();

    const insertInfo = await newsCollection.insertOne(newNews);

    if (insertInfo.insertedCount === 0) {
        error.message = JSON.stringify({
            'error': "could not create news",
            'object': newNews,
            'errors': errors
        });
        error.http_code = 400;
        throw error
    }

    const newId = insertInfo.insertedId.toString();

    return await getNewsById(newId);

}

async function addNewsList(newsList) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newsList === undefined || newsList === null) {
        errors['news'] = "news object not defined";
        error.http_code = 400
    } else if (typeof newsList !== "object") {
        errors['news'] = "invalid type of news";
        error.http_code = 400
    } else if (newsList.length === 0) {
        errors['news'] = "no news to add";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    const newsCollection = await newsCollections();

    const finalNewsList = newsList.map(function (news) {
        news._id = MUUID.from(uuidv3(news.url, uuidv3.URL));
        news.likedBy = [];
        news.dislikedBy = [];
        return news;
    });

    try {
        const insertInfo = await newsCollection.insertMany(finalNewsList);

        if (insertInfo.insertedCount === 0) {
            error.message = JSON.stringify({
                'error': "could not create news",
                'object': newsList,
                'errors': errors
            });
            error.http_code = 400;
            throw error
        }
        return await getNewsList(insertInfo.insertedIds);
    } catch (e) {
        return await getNewsList(finalNewsList.map(news => {
            return news._id
        }));
    }
}

async function getNewsById(newsId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newsId === undefined || newsId === null) {
        errors['id'] = "id is not defined";
        error.http_code = 400
    }
    if (typeof newsId === "string") {
        try {
            newsId = MUUID.from(newsId);
        } catch (e) {
            errors['id'] = e.message;
            error.http_code = 400;
            error.message = JSON.stringify({
                errors: errors
            });
            throw error
        }
    } else if (!isUUID(newsId)) {
        errors['id'] = "id is not defined";
        error.http_code = 400;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    const newsCollection = await newsCollections();

    const news = await newsCollection.findOne({_id: newsId});

    if (news === null) {
        errors['id'] = `news with id ${newsId} doesn't exists`;
        error.http_code = 404;
        error.message = JSON.stringify({
            errors: errors
        });
        throw error
    }

    return news;
}

async function getNewsList(newsIds) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (newsIds === undefined || newsIds === null) {
        errors['newsIds'] = "newsIds is not defined";
        error.http_code = 400
    } else if (newsIds.length === 0) {
        errors['newsIds'] = "newsIds is empty";
        error.http_code = 400
    }

    let finalNewsIds = [];
    for (let i = 0; i < newsIds.length; i++) {
        const newsId = newsIds[i];
        if (typeof newsId === "string") {
            try {
                finalNewsIds.push(MUUID.from(newsId));
            } catch (e) {
                errors[newsId] = e.message;
                error.http_code = 400;
                error.message = JSON.stringify({
                    errors: errors
                });
            }
        } else {
            try {
                finalNewsIds.push(MUUID.from(newsId));
            } catch (e) {
                errors[newsId.toString()] = "id is not defined";
                error.http_code = 400;
                error.message = JSON.stringify({
                    errors: errors
                });
            }
        }
    }

    if (finalNewsIds.length) {
        const newsCollection = await newsCollections();
        return newsCollection.find({_id: {$in: finalNewsIds}}).toArray();
    }
    return [];
}

async function getNewsByPublishedAt(publishedAt) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (publishedAt === undefined || publishedAt === null) {
        errors['publishedAt'] = "publishedAt not defined";
        error.http_code = 400
    } else if (typeof publishedAt !== "string") {
        errors['publishedAt'] = "invalid type of publishedAt";
        error.http_code = 400
    }

    try {
        return await getNewsById(uuidv1({msecs: new Date(publishedAt).getTime()}))
    } catch (e) {
        throw e
    }
}

async function updateNews(newsId, updatedNews) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    if (updatedNews === undefined || updatedNews === null) {
        errors['news'] = "news object not defined";
        error.http_code = 400
    } else if (typeof updatedNews !== "object") {
        errors['news'] = "invalid type of news";
        error.http_code = 400
    }

    if (error.http_code !== 200) {
        error.message = JSON.stringify({'errors': errors});
        throw error
    }

    try {
        await getNewsById(newsId);

        const newsCollection = await newsCollections();

        return await newsCollection.updateOne({_id: newsId}, {$set: updatedNews})
            .then(async function (updateInfo) {
                if (updateInfo.nModified === 0) {
                    error.message = JSON.stringify({
                        'error': "could not update news",
                        'object': updatedNews,
                        'errors': errors
                    });
                    error.http_code = 400;
                    throw error
                }
                return await getNewsById(newsId);
            });
    } catch (e) {
        throw e
    }
}

module.exports = {
    addNews,
    addNewsList,
    getNewsById,
    getNewsList,
    getNewsByPublishedAt,
    updateNews
};