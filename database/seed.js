const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost")
            .then(conn => global.conn = conn.db("workshoptdc"))
            .catch(err => console.log(err))
 
module.exports = { }