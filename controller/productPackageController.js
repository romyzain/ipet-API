const { query } = require('../database')

module.exports = {
	getAllPackage: async (req, res) => {
		try {
			let sql = `select * from parcel where active = 1`
			let packages = await query(sql)
			sql = `select pp.parcelId, pp.productId, productName, price, productQty, invStock, appStock, prod.active from parcel  p
            join product_parcel pp on p.id = pp.parcelId
            join products prod on pp.productId = prod.id 
            join stock s on prod.id = s.productId;`
			let products = await query(sql)
			sql = `select * from product_image`
			let images = await query(sql)
			// join product with image
			for (const product of products) {
				product.images = []
				for (const image of images) {
					if (image.productId === product.productId) {
						product.images.push(image)
					}
				}
			}
			// join with product
			for (const package of packages) {
				package.products = []
				package.available = true
				for (const product of products) {
					if (package.id === product.parcelId) {
						package.products.push(product)
						if (product.productQty > product.appStock || !product.active) {
							package.available = false
						}
					}
				}
			}
			// join product image
			res.status(200).send({
				status: 'Success',
				data: packages,
				message: 'Successfully fetched product package',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	searchProduct: async (req, res) => {
		try {
			let { seacrh } = req.query
			if (seacrh) seacrh = seacrh.replace(/'/g, '')
			let sql = `select p.id as productId, productName, price, invStock, appStock from products p join stock s on s.productId = p.id where p.active = 1 and productName like '%${search}%';`
			let result = await query(sql)
			res.status(200).send({
				status: 'Success',
				data: result,
				message: 'Successfully searched product',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	addPackage: async (req, res) => {
		const { title, data } = req.body
		if (title) title = title.replace(/'/g, "''")
		try {
			let sql = `insert into parcel (parcelName) values ("${title}")`
			let insert = await query(sql)
			for (const product of data) {
				try {
					sql = `insert into product_parcel (parcelId, productId, productQty) values (${insert.insertId}, ${product.productId}, ${product.qty})`
					await query(sql)
				} catch (err) {
					console.log(err)
					res.status(500).send({
						status: 'Failed',
						message: err.message,
					})
				}
			}
			res.status(201).send({
				status: 'Success',
				message: 'Successfully added product parcel',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	editPackage: async (req, res) => {
		let { title, data, parcelId } = req.body
		try {
			let sql = `select * from product_parcel where parcelId = ${parcelId}`
			let toBeDeleted = await query(sql)
			for (const data of toBeDeleted) {
				try {
					sql = `delete from product_parcel where id = ${data.id}`
					await query(sql)
				} catch (err) {
					console.log(err)
					res.status(500).send({
						status: 'Failed',
						message: err.message,
					})
				}
			}
			for (const product of data) {
				try {
					sql = `insert into product_parcel (parcelId, productId, productQty) values (${parcelId}, ${product.productId}, ${parseInt(
						product.productQty
					)})`
					await query(sql)
				} catch (err) {
					console.log(err)
					res.status(500).send({
						status: 'Failed',
						message: err.message,
					})
				}
			}
			if (title) {
				title = title.replace(/'/g, "''")
				console.log(title)
				sql = `update parcel set parcelName = '${title}' where id = ${parcelId}`
				await query(sql)
			}
			res.status(201).send({
				status: 'Success',
				message: 'Successfully edited product parcel',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	deletePackage: async (req, res) => {
		try {
			const { parcelId } = req.body
			let sql = `update parcel set active = 0 where id = ${parcelId}`
			await query(sql)
			res.status(200).send({
				status: 'Success',
				message: 'Successfully deleted product parcel',
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
