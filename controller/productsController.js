const { query, db } = require('../database')
const { uploader } = require('../helper/uploader')

const moment = require('moment')
moment.locale('id-ID')

// test nodemail
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'shadiqalifauzi.info@gmail.com',
		pass: 'mjamtvzseounvhty',
	},
})
const path = require('path')
Promise = require('bluebird')

const sendEmail = (obj) => {
	return transporter.sendMail(obj)
}

// test html-to pdf with puppeteer
const puppeteer = require('puppeteer')
const fs = require('fs-extra')
const hbs = require('handlebars')
// path di atas

const compile = async (templateName, data) => {
	const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
	const html = await fs.readFile(filePath, 'utf-8')
	return hbs.compile(html)(data)
}

hbs.registerHelper('dateFormat', (value, format) => {
	return moment(value).format(format)
})

hbs.registerHelper('concat', function (path) {
	return path + '/logo.png'
})

hbs.registerHelper('toLocaleString', (num) => {
	return num.toLocaleString('id-ID')
})

const htmlToPdf = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch()
			const page = await browser.newPage()
			const content = await compile('invoice-pdf/html', data)
			const randomNum = Math.floor(Math.random() * 10000) + `${Date.now()}`
			await fs.writeFile(`${process.cwd()}/${randomNum}.html`, content)
			const tempFilePath = path.join(process.cwd(), `/${randomNum}.html`)
			await page.goto(`file:${tempFilePath}`, { waitUntil: 'networkidle0' })
			await page.pdf({
				path: path.join(process.cwd(), `/public/invoice/${randomNum}.pdf`),
				format: 'A4',
				printBackground: true,
			})
			await browser.close()
			await fs.unlink(tempFilePath)
			resolve({ emailLink: `${data.API_URL}/invoice/${randomNum}.pdf`, sqlLink: `/invoice/${randomNum}.pdf` })
		} catch (err) {
			reject(Error(err))
		}
	})
}

module.exports = {
	fetchProducts: async (req, res) => {
		let sql = `select p.id as productId, p.productName, p.price, s.invStock, s.appStock, p.productDescription from 
        products p
        join stock s on s.productId = p.id where active = 1;`
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
		let sql = `select p.id,p.productName, p.price, s.invStock, s.appStock, p.productDescription from 
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
				sql = `update cart set qty='${result[0].qty + qty}' where id='${result[0].id}';`
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
		let sql = `select  p.id as productId, p.productName, c.qty, c.id as cartId, p.price from cart c
        join products p on p.id = c.productId
        where userId ='${id}' and onProcess = 1;`
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
				message: 'Successfully fetched cart',
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
	insertTransaction: async (req, res) => {
		let { cart, userId, totalPrice, API_URL, username, email } = req.body
		try {
			let date = moment().format('YYYY-MM-DD HH:mm:ss')
			let dueDate = moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
			let sql = `insert into transaction (userId, totalPrice, date) values ('${userId}', '${totalPrice}', '${date}')`
			let result = await query(sql)
			for (const cartItem of cart) {
				cartItem.subTotal = cartItem.qty * cartItem.price
				sql = `insert into transaction_item (cartId, transactionId) values ('${cartItem.cartId}', '${result.insertId}');`
				await query(sql)
			}

			let dataForHbs = {
				API_URL: API_URL,
				transactionId: result.insertId,
				date,
				dueDate,
				email,
				username,
				totalPrice,
				cart,
			}
			let pdf = await htmlToPdf(dataForHbs)
			sql = `update transaction set invoicePath = '${pdf.sqlLink}'  where id = ${result.insertId}`
			await query(sql)
			dataForHbs.invoiceUrl = pdf.emailLink
			let content = await compile('invoice-email/html', dataForHbs)
			sendEmail({
				to: dataForHbs.email,
				from: 'Admin Ipet',
				subject: `iPet Invoice for Transaction #${result.insertId}`,
				html: content,
				text: `iPet invoice #${result.insertId}`,
			})
			for (const cartItem of cart) {
				sql = `update cart set onProcess = 0 where id = ${cartItem.cartId}`
				await query(sql)
			}
			res.status(201).send({
				status: 'Success',
				data: { transactionId: dataForHbs.transactionId },
				message: 'Successfully insert transaction.',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	uploadPayment: async (req, res) => {
		try {
			const path = '/images/payment_image'
			const upload = uploader(path, 'PAY').fields([{ name: 'image' }])
			upload(req, res, (err) => {
				const { image } = req.files
				let { transactionId } = req.body
				const imagePath = image ? `${path}/${image[0].filename}` : null
				let sql = `update transaction set paymentImg = '${imagePath}' where id = ${transactionId}`
				db.query(sql, async (err, results) => {
					if (err) {
						console.log(err)
						if (imagePath) {
							fs.unlinkSync(`../public${imagePath}`)
						}
						return res.status(500).send(err.message)
					}
					return res.status(201).send({
						status: 'created',
						message: 'Data Created!',
					})
				})
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
