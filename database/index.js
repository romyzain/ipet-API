const mysql = require('mysql')
const util = require('util')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'bi5miLLah',
    database : 'ipet',
    port : 3306
})

const query = util.promisify(db.query).bind(db)
module.exports = {
    db,
    query
}