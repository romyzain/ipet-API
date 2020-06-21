const { query } = require('../database')
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
const { min } = require('moment')
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
			const content = await compile('receipt-pdf/html', data)
			const randomNum = Math.floor(Math.random() * 10000) + `${Date.now()}`
			await fs.writeFile(`${process.cwd()}/${randomNum}.html`, content)
			const tempFilePath = path.join(process.cwd(), `/${randomNum}.html`)
			await page.goto(`file:${tempFilePath}`, { waitUntil: 'networkidle0' })
			await page.pdf({
				path: path.join(process.cwd(), `/public/receipt/${randomNum}.pdf`),
				format: 'A4',
				printBackground: true,
			})
			await browser.close()
			await fs.unlink(tempFilePath)
			resolve({ emailLink: `${data.API_URL}/receipt/${randomNum}.pdf`, sqlLink: `/receipt/${randomNum}.pdf` })
		} catch (err) {
			reject(Error(err))
		}
	})
}

module.exports = {
	getTransaction: async (req, res) => {
		let { id, pending, reject, approval, username, maxDate, minDate, currentPage } = req.body
		let condition = ''
		if (id) {
			condition = ` t.id = ${id}`
		} else if (pending) {
			condition = 'pending = 1'
		} else if (reject) {
			condition = 'reject = 1'
		} else if (approval) {
			condition = 'approval = 1'
		}
		let sql = `select transactionId, c.userId, username, email, totalPrice, paymentImg, pending, approval, reject, date, invoicePath, receiptPath, rejectMessage
        from transaction_item ti 
        join transaction t on ti.transactionId = t.id
        join cart c on ti.cartId = c.id
        join users u on c.userId = u.id `
		if (condition || username || maxDate || minDate) {
			sql += 'where '
			if (condition) {
				sql += condition
				if (username || maxDate || minDate) sql += ' and'
			}
			if (username) {
				sql += ` username like '%${username}%'`
				if (maxDate || minDate) sql += ' and'
			}
			if (minDate) {
				sql += ` date >= '${minDate}'`
				if (maxDate) sql += ' and'
			}
			if (maxDate) {
				sql += `  date < '${maxDate}'`
			}
		}
		sql += ` group by transactionId order by date desc`
		try {
			// console.log(sql)
			// count total data on sql to paginate
			let data = await query(sql)
			let totalData = data.length

			// start fetch transaction
			if (currentPage >= 0) {
				//offset >= 0
				sql += ` limit 15 offset ${currentPage * 15}` // offset
			}
			let transaction = await query(sql)

			// fetch cart with products
			sql = `select ti.cartid, ti.transactionId, c.productId, qty, productName, price, invStock, appStock
			from transaction_item ti 
			join cart c on ti.cartId = c.id 
			join products p on c.productId = p.id 
			join stock s on s.productId = p.id
			order by ti.id;`
			let cart = await query(sql)

			// join pending transanction and cart
			for (const [i, t] of transaction.entries()) {
				t.date = moment(t.date).format('Do MMMM YYYY, HH:mm:ss')
				// var date_test = new Date(t.date.replace(/-/g, '/'))
				// console.log(date_test)
				t.cart = []
				for (const c of cart) {
					if (t.transactionId === c.transactionId) t.cart.push(c)
				}
			}

			// fetch total pending transactions
			let totalPending = await query(`SELECT count(id) as totalPending FROM transaction where pending = 1;`)

			res.status(200).send({
				status: 'Success',
				data: {
					transaction,
					totalPending: totalPending[0].totalPending,
					totalData,
				},
				message: 'Successfully changed transaction status.',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	changeStatus: async (req, res) => {
		const { approve, reject, transactionId, data, API_URL } = req.body
		try {
			let sql = ''
			if (approve) {
				for(const cartItem of data[0].cart){
					let newStock = cartItem.invStock - cartItem.qty
					sql = `update stock set invStock = '${newStock}' where productId = '${cartItem.productId}'`
					await query(sql)
					cartItem.subTotal = cartItem.qty * cartItem.price
				}
				data[0].API_URL = API_URL
				let pdf = await htmlToPdf(data[0])
				sql = `update transaction set pending = 0, approval = 1, receiptPath = '${pdf.sqlLink}' where id = ${transactionId}`
				data[0].receiptUrl = pdf.emailLink
				let content = await compile('receipt-email/html', data[0])
				sendEmail({
					to: data[0].email,
					from: 'Admin Ipet',
					subject: `iPet Receipt #${data[0].transactionId}`,
					html: content,
					text: `iPet Receipt #${data[0].transactionId}`,
				})
			}
			if (reject) {
				sql = `update transaction set pending = 0, reject = 1, rejectMessage = '${data.message}' where id = ${transactionId}`
			}
			let insert = await query(sql)
			res.status(201).send({
				status: 'Success',
				data: insert,
				message: 'Successfully fetched pending transaction.',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	fetchPending: async (req, res) => {
		try {
			let totalPending = await query(`SELECT count(id) as totalPending FROM transaction where pending = 1;`)
			res.status(200).send({
				status: 'Success',
				data: totalPending[0].totalPending,
				message: 'Successfully fetched pending transaction.',
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
