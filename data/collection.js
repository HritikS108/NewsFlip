const dbConnection = require("./connection");

const getCollectionFn = collection => {
    let _col = undefined;

    return async () => {
        console.log("A")
        if (!_col) {
            console.log("B")
             const db = await dbConnection();
             console.log("C");
            _col = await db.collection(collection);
            console.log("D");
        }
        console.log("C");
        return _col;
    };
};

module.exports = {
    users: getCollectionFn("Users"),
    sessions: getCollectionFn("Sessions"),
    news: getCollectionFn("News"),
};
