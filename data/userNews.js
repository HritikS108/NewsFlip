const users = require("./users");
const news = require("./news");

async function likeNews(userId, newsId) {
    try {
        const user = await users.getUserById(userId, {"liked": true});
        const news = await news.getNewsById(newsId);

        user.liked.push(news._id);
        news.likedBy.push(user._id);

        await users.updateUser(userId, user);
        await news.updateNews(newsId, news);
    } catch (e) {
        throw e
    }
}

async function dislikeNews(userId, newsId) {
    try {
        const user = await users.getUserById(userId, {"disliked": true});
        const news = await news.getNewsById(newsId);

        user.disliked.push(news._id);
        news.dislikedBy.push(user._id);

        await users.updateUser(userId, user);
        await news.updateNews(newsId, news);
    } catch (e) {
        throw e
    }
}

async function shareNews(senderId, receiverIds, newsId) {
    const error = new Error();
    error.http_code = 200;
    const errors = {};

    try {
        const sender = await users.getUserById(senderId, {"sent": true});
        const news = await news.getNewsById(newsId);
        const dateTime = new Date();

        for (let i = 0; i < receiverIds.length; i++) {
            const receiverId = receiverIds[i];
            if (await users.userExists(receiverId)) {

                const receiver = await users.getUserById(receiverId, {"received": true});
                receiver.received.push({
                    "from": sender._id,
                    "newsId": news._id,
                    "receivedAt": dateTime
                });
                await users.updateUser(receiverId, receiver);

                sender.sent.push({
                    "to": receiver._id,
                    "newsId": news._id,
                    "sentAt": dateTime
                })

            } else {
                errors[receiverId] = `user with id ${receiverId} not found`
            }
        }
        await users.updateUser(senderId, sender);
    } catch (e) {
        throw e
    }
}

module.exports = {
    likeNews,
    dislikeNews,
    shareNews
};