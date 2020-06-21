const mysql = require('mysql')
const util = require('util')

// const db = mysql.createConnection({
//     socketPath : '/cloudsql/awesome-ripsaw-273111:asia-southeast2:ipet-mysql',
//     user : 'root',
//     password : 'xCfF9ozOe4j1xPa3',
//     database : 'ipet',
// })

const db = mysql.createConnection({
    host : 'localhost',
    user : 'shadiq',
    password : 'root',
    database : 'ipet',
    port : 3306
})

const query = util.promisify(db.query).bind(db)

module.exports = {
    db,
    query
}