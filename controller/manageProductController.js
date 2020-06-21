const { query, db } = require('../database')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {
	getAllProducts: async (req, res) => {
		// filter queries
		let { search, minPrice, maxPrice, sortBy, category, offset } = req.query
		// get initial products with stock
		let sql = `select 
		p.id as productId, 
		productName, 
		price, 
		invStock, 
		appStock,
		IfNull(views, 0) as views, 
		IfNull(totalPurchased, 0) as totalPurchased,
		max(case when rn = 1 then category end) category1,
		max(case when rn = 2 then category end) category2,
		max(case when rn = 3 then category end) category3
			from products p
			left join (
				select p.id as productId, sum(qty) as totalPurchased
					from transaction_item ti 
					join transaction t on ti.transactionId = t.id 
					join cart c on c.id = ti.cartId 
					join products p on p.id = c.productId 
					where approval = 1 
					group by p.id
			) cart on p.id = cart.productId
			left join stock s on p.id = s.productId
			left join (
					select productId, count(id) as views
							from product_view
							group by productId
			) product_view on p.id = product_view.productId
			left join (
					select 
						prod.id,
						active,
						c.category,
						row_number() over(partition by prod.id order by c.id) rn
					from products prod
					join product_category pc on pc.productId = prod.id
					join category c on c.id = pc.categoryId
			) as pivot on pivot.id = p.id
			where p.active = 1 `

		if (search || minPrice || maxPrice) {
			if (search) sql += ` and productName like '%${req.query.search}%'`
			if (minPrice) sql += ` and price >= ${parseInt(minPrice)}`
			if (maxPrice) sql += ` and price <= ${parseInt(maxPrice)}`
		}
		sql += ` group by p.id`
		if (category) {
			category = JSON.parse(category)
			for (var i = 0; i < 3; i++) {
				if (category[i]) {
					if (i !== 0) sql += ` and`
					if (i === 0) sql += ` having`
					sql += ` (max(case when rn = 1 then category end) = '${category[i].label}' or max(case when rn = 2 then category end) = '${category[i].label}' or max(case when rn = 3 then category end) = '${category[i].label}')`
				}
			}
		}
		if (sortBy) sql += ` order by ${decodeURI(sortBy)}`
		try {
			// count total active products without offset to get total
			let active = await query(sql)
			let totalActiveProducts = active.length
			// start fetch product
			if (offset >= 0) {
				sql += ` limit 5 offset ${offset}`
			}
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
			res.status(200).send({
				status: 'Success',
				data: { results, totalActiveProducts },
				message: 'Successfully fetched product',
			})
		} catch (err) {
			console.log(err)
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
			{ name: 'image3' },
			{ name: 'image4' },
			{ name: 'image5' },
		])
		upload(req, res, async (err) => {
			if (err) {
				return res.status(500).send({
					status: 'Failed',
					message: err.message,
				})
			}
			let { productName, price, productDescription, invStock, appStock, category1, category2, category3 } = req.body
			let sql = `insert into products (productName, price, productDescription) values ('${productName}', ${price}, '${productDescription}')`
			try {
				// add new product
				let insert = await query(sql)
				// add stock
				sql = `insert into stock (productId, invStock, appStock) values (${insert.insertId}, ${invStock}, ${appStock})`
				await query(sql)
				// add 5 images to product_image
				req.files = [req.files.image1, req.files.image2, req.files.image3, req.files.image4, req.files.image5]
				for(const img of req.files){
					if (img) {
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
					}
				}

				// add categories to product_category
				let category = [category1, category2, category3]
				for(const val of category){
					if (val) {
						sql = `insert into product_category (categoryId, productId) values (${val}, ${insert.insertId})`
						try {
							await query(sql)
						} catch (err) {
							res.status(500).send({
								status: 'Failed',
								message: err.message,
							})
						}
					}
				}
				res.status(201).send({
					status: 'Success',
					data: insert,
					message: 'Successfully added new product',
				})
			} catch (err) {
				console.log(err)
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
			let oldImagePath = []
			for(const image of results){
				oldImagePath.push(image.imagePath)
			}
			sql = `select * from product_category where productId = '${id}'`
			let categories = await query(sql)

			// upload updated image (or not doesnt matter)
			const path = '/images/product'
			const upload = uploader(path, 'PROD').fields([
				{ name: 'image1' },
				{ name: 'image2' },
				{ name: 'image3' },
				{ name: 'image4' },
				{ name: 'image5' },
			])
			upload(req, res, async (err) => {
				if (err) {
					return res.status(500).send({
						status: 'Failed',
						message: err.message,
					})
				}
				let { productName, price, productDescription, invStock, appStock, category1, category2, category3, deleteImageArr } = req.body
				let sql = `update products set productName = '${productName}', price = ${parseInt(price)}, productDescription = '${productDescription}' where id = ${id};`
				try {
					// update product table
					await query(sql)
					// update stock table
					sql = `update stock set invStock = ${parseInt(invStock)}, appStock = ${parseInt(appStock)} where productId = ${id};`
					await query(sql)
					// update product image
					req.files = [req.files.image1, req.files.image2, req.files.image3, req.files.image4, req.files.image5]
					for(const [i, img] of req.files.entries()){
						if (img) {
							const imagePath = img ? `${path}/${img[0].filename}` : oldImagePath[i]
							try {
								if (results[i]) {
									sql = `update product_image set imagePath = '${imagePath}' where id = ${results[i].id};`
									await query(sql)
									if (oldImagePath[i]) {
										fs.unlinkSync(`./public${oldImagePath[i]}`)
									}
								} else {
									sql = `insert into product_image (imagePath, productId) VALUES ('${imagePath}', '${id}');`
									await query(sql)
								}
							} catch (err) {
								console.log(err)
								fs.unlinkSync(`./public${imagePath}`)
								res.status(500).send({
									status: 'Failed',
									message: err.message,
								})
							}
						}
					}
					// update category table
					let category = [parseInt(category1), parseInt(category2), parseInt(category3)]
					for(const [i, val] of category.entries()){
						try {
							if (val) {
								if (categories[i] && val !== categories[i].categoryId) {
									sql = `update product_category set categoryId = ${val} where id = ${categories[i].id};`
									await query(sql)
								} else if (!categories[i]) {
									sql = `insert into product_category (categoryId, productId) values (${val}, ${id})`
									await query(sql)
								}
							} else if (isNaN(val) && categories[i]) {
								sql = `delete from product_category where id = ${categories[i].id};`
								await query(sql)
							}
						} catch (err) {
							console.log(err)
							res.status(500).send({
								status: 'Failed',
								message: err.message,
							})
						}
					}

					// delete image
					for(const[index, id] of deleteImageArr.entries()){
						if (id !== 'false') {
							console.log('masuk delete', id)
							db.query(`delete from product_image where id = ${id}`, (err, results) => {
								if (err) {
									return res.status(500).send({
										status: 'Failed',
										message: err.message,
									})
								}
								fs.unlinkSync(`./public${oldImagePath[index]}`)
							})
						}
					}

					res.status(201).send({
						status: 'Success',
						data: `Successfully updated product with the id of ${id}`,
					})
				} catch (err) {
					console.log(err)
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

		let sql = `update products set active = 0 where id = ${req.params.id}`
		try {
			await query(sql)
			res.status(200).send({
				status: 'Success',
				message: `Successfully delete product with the id of ${req.params.id}`,
			})
		} catch (err) {
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	getOneProduct: async (req, res) => {
		let sql = `select p.id as productId, productName, price, invStock, appStock, active, productDescription from products p join stock s on p.id = s.productId where p.id = ${req.params.id}`
		try {
			let result = await query(sql)
			sql = `select id as productImageId, imagePath from product_image where productId = ${result[0].productId}`
			let productImage = await query(sql)
			result[0].images = productImage
			// join category
			sql = `select pc.id as productCategoryId, categoryId, category from product_category pc join category c on c.id = pc.categoryId where productId = ${result[0].productId}`
			let category = await query(sql)
			result[0].category = category
			res.status(200).send({
				status: 'Success',
				data: result[0],
				message: `Successfully fetch product with the id of ${req.params.id}`,
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	fetchCategory: async (req, res) => {
		let sql = `select id as value, category as label from category`
		try {
			let categoryList = await query(sql)
			res.status(200).send({
				status: 'Success',
				data: categoryList,
				message: 'Successfully fetched category',
			})
		} catch (err) {
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	addCategory: async (req, res) => {
		let sql = `insert into category (category) values ('${req.body.category}')`
		try {
			let insert = await query(sql)
			res.status(201).send({
				status: 'Success',
				data: insert,
				message: 'Successfully added new category',
			})
		} catch (err) {
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
}
