const express = require('express')
const app = express()
const port = process.env.PORT || 2000
const cors = require('cors')
const bearerToken = require('express-bearer-token')
const { db } = require('./database/index')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bearerToken())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).send('<h1>Welcome to iPet API</h1>')
})

app.get('/test', (req, res) => {
    let sql = `select * from products`

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err.message)
        }
        res.status(200).send(results)
    })
})

app.listen(port, () => console.log(`API Active at Port ${port}`))
