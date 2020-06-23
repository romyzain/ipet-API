const { query } = require('../database')
const moment = require('moment')
moment.locale('en-US')

const zeroify = (num) => {
	return num < 10 ? `0${num}` : num
}

console.log(moment().format('MMMM Do YYYY, HH:mm:ss'))

module.exports = {
	getReport: async (req, res) => {
		const { id, productId } = req.query
		try {
			let sql = `select * from report_view`
			let reportView = await query(sql)
			let reportById = reportView.find((e) => e.id === parseInt(id))

			sql = `select * from ${reportById.viewName} order by totalPurchased desc limit 5`
			const result = await query(sql)
			// manipulate to a chartjs readable values
			const mostPopular = {
				labels: [],
				datasets: [
					{
						label: `Top 5 Purchased Products On ${moment(`${reportById.year}${zeroify(reportById.month)}`).format('MMMM')} ${
							reportById.year
						}`,
						backgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
						data: [],
					},
				],
			}
			// loop data for datasets
			for (const product of result) {
				mostPopular.labels.push(product.productName)
				mostPopular.datasets[0].data.push(product.totalPurchased)
			}

			// count product views
			let reportIndex = reportView.findIndex((e) => e.id === parseInt(id))

			let productData = []
			for (var i = 11 - reportIndex >= 0 ? 0 : -(11 - reportIndex); i <= reportIndex; i++) {
				sql = `select id, productName, currentViews, totalPurchased, productRevenue from ${reportView[i].viewName} order by id asc`
				let response = await query(sql)
				productData.push({
					month: reportView[i].month,
					year: reportView[i].year,
					response,
				})
			}

			// get this month and last month revenue & total items sold
			let currentSold = 0
			let currentRevenue = 0
			for (const current of productData[productData.length - 1].response) {
				currentRevenue += current.productRevenue
				currentSold += current.totalPurchased
			}

			let prevSold = 0
			let prevRevenue = 0
			if (productData[productData.length - 2]) {
				for (const prev of productData[productData.length - 2].response) {
					prevRevenue += prev.productRevenue
					prevSold += prev.totalPurchased
				}
			}

			// make datasets for productLineChart
			const productChartData = {
				labels: [],
				datasets: [
					{
						data: [],
					},
				],
			}

			if(productId){
				for (const product of productData) {
					productChartData.labels.push(moment(`${product.year}${product.month}`, 'YYYYM').format('MMMM YYYY'))
					let find = product.response.find((e) => e.id === parseInt(productId))
					productChartData.datasets[0].data.push(find.currentViews)
				}
			}

			res.status(200).send({
				status: 'Success',
				data: {
					mostPopular,
					productChartData,
					revenue: { currentRevenue, prevRevenue },
					sold: { currentSold, prevSold },
					reportDate: {month: reportById.month, year: reportById.year} 
				},
				message: 'Successfully fetched monthly report',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	getSelectOptions: async (req, res) => {
		try {
			let sql = `select * from report_view`
			let reportView = await query(sql)
			let selectMonth = []
			for (const date of reportView) {
				selectMonth.push({
					value: date.id,
					label: `${moment(`${date.year}${zeroify(date.month)}`).format('MMMM YYYY')}`,
				})
			}

			sql = `select id, productName from products where active = 1 order by id asc;`
			let productNames = await query(sql)
			let selectProduct = []
			for (const product of productNames) {
				selectProduct.push({
					value: product.id,
					label: product.productName,
				})
			}

			res.status(200).send({
				status: 'Success',
				data: { selectMonth, selectProduct },
				message: 'Successfully fetched select options report',
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
	dummyData: async (req, res) => {
		try {
			const randproduct = (min, max) => {
				let result = 0
				do {
					min = Math.ceil(min)
					max = Math.floor(max)
					result = Math.floor(Math.random() * (max - min + 1)) + min
				} while (result === 52 || result === 53)
				return result
			}
			const randomTotalViews = (min, max) => {
				min = Math.ceil(min)
				max = Math.floor(max)
				result = Math.floor(Math.random() * (max - min + 1)) + min
				return result
			}

			// dummy data for transaction
			// for (i = 0; i < 20; i++) {
			// 	const user = Math.ceil(Math.random() * 10)
			// 	const date = Math.ceil(Math.random() * 30)
			// 	const hour = Math.ceil(Math.random() * 23)
			// 	const minute = Math.ceil(Math.random() * 59)
			// 	const second = Math.ceil(Math.random() * 59)

			// 	let sql = `INSERT INTO transaction (userId, totalPrice, pending, approval, paymentImg, date) VALUES ('${user}', '0', '0', '1' ,'http://via.placeholder.com/450x300', '2020-05-${zeroify(
			// 		date
			// 	)} ${zeroify(hour)}:${zeroify(minute)}:${zeroify(second)}');`
			// 	let transaction = await query(sql)
			// 	const loop = user % 2 ? 3 : 2
			// 	for (j = 0; j < loop; j++) {
			// 		let qty = Math.ceil(Math.random() * 25)
			// 		sql = `INSERT INTO cart (productId, userId, qty, subTotal) VALUES ('${randproduct(46, 81)}', '${user}', '${qty}', '0');`
			// 		let cart = await query(sql)
			// 		sql = `insert into transaction_item (cartId, transactionId) VALUES ('${cart.insertId}','${transaction.insertId}')`
			// 		await query(sql)
			// 	}
			// }

			//dummy data for product views
			// const months = ['02', '03', '04', '05']
			// for (const month of months) {
			// 	console.log(month)
			// 	let randomTotal = randomTotalViews(800, 1300)
			// 	for (i = 0; i < randomTotal; i++) {
			// 		const user = Math.ceil(Math.random() * 10)
			// 		const date = Math.ceil(Math.random() * 28)
			// 		const hour = Math.ceil(Math.random() * 23)
			// 		const minute = Math.ceil(Math.random() * 59)
			// 		const second = Math.ceil(Math.random() * 59)
			// 		let sql = `INSERT INTO product_view (productId, userId, date) VALUES ('${randproduct(
			// 			46,
			// 			81
			// 		)}', '${user}', '2020-${month}-${zeroify(date)} ${zeroify(hour)}:${zeroify(minute)}:${zeroify(second)}');`
			// 		await query(sql)
			// 	}
			// }

			//count totalPrice for transaction
			let sql = `select ti.cartid, ti.transactionId, c.productId, qty, productName, price, invStock, appStock
			from transaction_item ti 
			join cart c on ti.cartId = c.id 
			join products p on c.productId = p.id 
			join stock s on s.productId = p.id
			order by ti.id;`

			let carts = await query(sql)
			for(const cart of carts){
				sql = `select * from transaction where id = ${cart.transactionId}`
				let transaction = await query(sql)
				let currentTotal = transaction[0].totalPrice
				let newTotal = currentTotal + (cart.price * cart.qty)
				sql = `update transaction set totalPrice = '${newTotal}' where id = ${cart.transactionId}`
				await query(sql)
			}

			console.log('sukses!!!')
		} catch (err) {
			console.log(err)
			res.status(500).send({
				status: 'Failed',
				message: err.message,
			})
		}
	},
}
