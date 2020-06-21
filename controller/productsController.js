const { query, db } = require('../database')
const { uploader } = require('../helper/uploader')
const moment = require('moment')
const fs = require('fs')

module.exports = {
    fetchProducts: async (req, res) => {
        let sql = `select p.id as productId, p.productName, p.price, s.invStock, s.appStock from 
        products p
        join stock s on s.productId = p.id;`
        try {
            let products = await query(sql)

            //Join Category
            sql = `select * from product_category pc
            join category c on c.id = pc.categoryId;`
            let category = await query(sql)
            for (i = 0; i < products.length; i++) {
                let categories = []
                for (j = 0; j < category.length; j++) {
                    if (products[i].productId === category[j].productId) {
                        categories.push(category[j])
                    }
                }
                products[i].categories = categories
            }

            // Join Images
            sql = `select * from product_image;`
            let image = await query(sql)
            for (i = 0; i < products.length; i++) {
                let images = []
                for (j = 0; j < image.length; j++) {
                    if (products[i].productId === image[j].productId) {
                        images.push(image[j])
                    }
                }
                products[i].images = images
            }

            res.status(200).send({
                status: 'Success',
                message: 'Suceess',
                data: products,
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    fetchProductsById: async (req, res) => {
        let { id } = req.params
        let sql = `select p.id,p.productName, p.price, s.invStock, s.appStock from 
        products p
        join stock s on s.productId = p.id where p.id = '${id}'`
        try {
            let products = await query(sql)

            sql = `select * from product_image where productId = '${id}'`
            let image = await query(sql)
            products[0].images = image

            sql = `select category from product_category pc
            join category c on c.id = pc.categoryId where pc.productId ='${id}'`
            let category = await query(sql)
            products[0].categories = category
            // console.log(image)
            res.status(200).send({
                status: 'Success',
                message: 'Success',
                data: products,
            })
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    addToCart: async (req, res) => {
        let { productId, userId, qty } = req.body
        let sql = `select * from cart where userId='${userId}' and onProcess = 1 and productId ='${productId}';`
        try {
            let result = await query(sql)
            if (result.length !== 0) {
                sql = `update cart set qty='${result[0].qty + qty}' where id='${
                    result[0].id
                }';`
                await query(sql)
            } else {
                sql = `insert into cart (productId, userId, qty) values ('${productId}', '${userId}', '${qty}' );`
                let insertCart = await query(sql)
            }
            res.status(200).send({
                status: 'Success',
            })
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    getCart: async (req, res) => {
        let { id } = req.params
        let sql = `select  p.id as productId, p.productName, c.qty, c.id as cartId from cart c
        join products p on p.id = c.productId
        where userId ='${id}' and onProccess = 1;`
        try {
            let cart = await query(sql)

            //Join IMAGE
            sql = `select * from product_image;`
            let image = await query(sql)
            for (i = 0; i < cart.length; i++) {
                let images = []
                for (j = 0; j < image.length; j++) {
                    if (cart[i].productId === image[j].productId) {
                        images.push(image[j])
                    }
                }
                cart[i].images = images
            }
            res.status(200).send({
                status: 'Success',
                data: cart,
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    deleteCart: async (req, res) => {
        let { id } = req.params
        let sql = `delete from cart where id = '${id}';`
        try {
            let del = await query(sql)

            res.status(200).send({
                status: 'Success',
                data: `Successfully delete cart with id ${id} `,
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    checkOut: async (req, res) => {
        try {
            const path = '/images/payment_image'
            const upload = uploader(path, 'PAY').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                const { image } = req.files
                let { userId, totalPrice, cart } = req.body
                // cart = JSON.parse(cart)

                const imagePath = image ? `${path}/${image[0].filename}` : null

                let sql = `insert into transaction (userId, totalPrice, paymentImg, date) 
                values ('${userId}', '${totalPrice}', '${imagePath}', '${moment().format(
                    'YYYY-MM-DD h:mm:ss'
                )}');`
                db.query(sql, async (err, results) => {
                    if (err) {
                        console.log(err)
                        if (imagePath) {
                            fs.unlinkSync(`../public${imagePath}`)
                        }
                        return res.status(500).send(err.message)
                    }
                    for (i = 0; i < cart.length; i++) {
                        sql = `insert into transaction_item (cartId, transactionId) values
                            ('${cart[i].id}', '${results.insertId}');`
                        await query(sql)
                    }
                    res.status(201).send({
                        status: 'created',
                        message: 'Data Created!',
                    })
                })
            })
            res.status(200).send({
                status: 'Success',
                data: 'Success',
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
}
