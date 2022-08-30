const MongoClient = require("mongodb").MongoClient;
const settings = require("../settings");
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {

    if (!_connection) {

        // console.log("Connect nhi ho rha");
        // console.log(mongoConfig.serverUrl);
        
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {useNewUrlParser: true });
        // console.log(1);
        // console.log(_connection);
        // console.log(3);
        _db = await _connection.db(mongoConfig.database);

        // console.log(_db)
    }
    console.log("ALL GOOD")

    return _db;
};
