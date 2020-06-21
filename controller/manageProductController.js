const { query, db } = require('../database')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {
    getAllProducts: async (req, res) => {
        // filter queries
        let { search, minPrice, maxPrice } = req.query
        // get initial products with stock
        let sql = `select p.id as productId, productName, price, invStock, appStock from products p join stock s on p.id = s.productId`
        if (search || minPrice || maxPrice) {
            sql += ` where`
            if (search) sql += ` productName like '%${req.query.search}%'`
            if (search && minPrice) sql += ` and`
            if (minPrice) sql += ` price >= ${parseInt(minPrice)}`
            if ((search && maxPrice) || (minPrice && maxPrice)) sql += ` and`
            if (maxPrice) sql += ` price <= ${parseInt(maxPrice)}`
        }
        try {
            let results = await query(sql)
            // join images
            for (i = 0; i < results.length; i++) {
                sql = `select id as productImageId, imagePath from product_image where productId = ${results[i].productId}`
                let productImage = await query(sql)
                results[i].images = productImage
            }
            // join category
            for (i = 0; i < results.length; i++) {
                sql = `select pc.id as productCategoryId, category from product_category pc join category c on c.id = pc.categoryId where productId = ${results[i].productId}`
                let category = await query(sql)
                results[i].category = category
            }
            // retrieve categories
            sql = `select id as value, category as label from category`
            let categoryList = await query(sql)
            res.status(200).send({
                status: 'Success',
                data: { results, categoryList },
                message: 'Successfully fetched product',
            })
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    addProduct: async (req, res) => {
        let path = '/images/product'
        // uploads image to API
        const upload = uploader(path, 'PROD').fields([
            { name: 'image1' },
            { name: 'image2' },
        ])
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).send({
                    status: 'Failed',
                    message: err.message,
                })
            }
            let {
                productName,
                price,
                invStock,
                appStock,
                category1,
                category2,
            } = req.body
            let sql = `insert into products (productName, price) values ('${productName}', ${price})`
            try {
                // add new product
                let insert = await query(sql)
                // add stock
                sql = `insert into stock (productId, invStock, appStock) values (${insert.insertId}, ${invStock}, ${appStock})`
                await query(sql)
                // add 2 images to product_image
                req.files = [req.files.image1, req.files.image2]
                req.files.forEach(async (img) => {
                    const imagePath = img ? `${path}/${img[0].filename}` : null
                    sql = `insert into product_image (imagePath, productId) values ('${imagePath}', ${insert.insertId})`
                    try {
                        await query(sql)
                    } catch (err) {
                        fs.unlinkSync(`./public${imagePath}`)
                        res.status(500).send({
                            status: 'Failed',
                            message: err.message,
                        })
                    }
                })
                // add categories to product_category
                let category = [category1, category2]
                category.forEach(async (val) => {
                    sql = `insert into product_category (categoryId, productId) values (${val}, ${insert.insertId})`
                    try {
                        await query(sql)
                    } catch (err) {
                        res.status(500).send({
                            status: 'Failed',
                            message: err.message,
                        })
                    }
                })
                res.status(200).send({
                    status: 'Success',
                    data: insert,
                    message: 'Successfully added new product',
                })
            } catch (err) {
                res.status(500).send({
                    status: 'Failed',
                    message: err.message,
                })
            }
        })
    },
    editProduct: async (req, res) => {
        let { id } = req.params
        let sql = `select * from product_image where productId = '${id}'`
        try {
            let results = await query(sql)
            let oldImagePath = [results[0].imagePath, results[1].imagePath]
            sql = `select * from product_category where productId = '${id}'`
            let categories = await query(sql)

            // upload updated image (or not doesnt matter)
            const path = '/images/product'
            const upload = uploader(path, 'PROD').fields([
                { name: 'image1' },
                { name: 'image2' },
            ])
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'Failed',
                        message: err.message,
                    })
                }
                let {
                    productName,
                    price,
                    invStock,
                    appStock,
                    category1,
                    category2,
                } = req.body
                let sql = `update products set productName = '${productName}', price = ${parseInt(
                    price
                )} where id = ${id};`
                try {
                    // update product table
                    await query(sql)
                    // update stock table
                    sql = `update stock set invStock = ${parseInt(
                        invStock
                    )}, appStock = ${parseInt(
                        appStock
                    )} where productId = ${id};`
                    await query(sql)
                    // update product image
                    req.files = [req.files.image1, req.files.image2]
                    req.files.forEach(async (img, i) => {
                        const imagePath = img
                            ? `${path}/${img[0].filename}`
                            : oldImagePath[i]
                        sql = `update product_image set imagePath = '${imagePath}' where id = ${results[i].id};`
                        try {
                            if (img) {
                                await query(sql)
                                fs.unlinkSync(`./public${oldImagePath[i]}`)
                            }
                        } catch (err) {
                            fs.unlinkSync(`./public${imagePath}`)
                            res.status(500).send({
                                status: 'Failed',
                                message: err.message,
                            })
                        }
                    })
                    // update category table
                    let category = [category1, category2]
                    category.forEach(async (val, i) => {
                        try {
                            if (val) {
                                sql = `update product_category set categoryId = ${val} where id = ${categories[i].id};`
                                await query(sql)
                            }
                        } catch (err) {
                            res.status(500).send({
                                status: 'Failed',
                                message: err.message,
                            })
                        }
                    })
                    res.status(200).send({
                        status: 'Success',
                        data: `Successfully updated product with the id of ${id}`,
                    })
                } catch (err) {
                    res.status(500).send({
                        status: 'Failed',
                        message: err.message,
                    })
                }
            })
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
    deleteProduct: async (req, res) => {
        let sql = `select * from product_image where productId = ${req.params.id}`
        try {
            let results = await query(sql)
            results.forEach((img) => {
                fs.unlinkSync(`./public${img.imagePath}`)
            })
            sql = `delete from products where id = ${req.params.id}`
            await query(sql)
            res.status(200).send({
                status: 'Success',
                data: `Successfully delete product with the id of ${req.params.id}`,
            })
        } catch (err) {
            res.status(500).send({
                status: 'Failed',
                message: err.message,
            })
        }
    },
}
