const db = require('../database');
const Crypto = require('crypto');
const { createJWTToken } = require('../helper/jwt');
const transporter = require('../helper/nodemailer');
const { uploader } = require('../helper/uploader');
const fs = require('fs')

module.exports = {
    Register : (req,res) => {
        let { username, password, email } = req.body;
        let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
         let sql = `insert into users (username, password, roleId, email, verified) values('${username}', '${hashPassword}', 2 , '${email}', 0)`;
        db.query(sql, (err,insert) => {
            if(err){
                console.log(err)
                res.status(500).send(err.message)
            }else{
                let sql = `select id, username, roleId, email, password, verified from users where id = ${insert.insertId}`;
                db.query(sql, (err,results) => {
                    if(err){
                        res.status(500).send({
                            status : 'Failed',
                            message : err.message
                        })
                    }
                    let { email, username, password } = results[0];
                    let url = `http://localhost:3000/verify?username=${username}&password=${password}`;
                    let mailOptions = {
                        from : 'Admin <artharf@gmail.com>',
                        to : email,
                        subject : 'Email Verification',
                        html : `<p>Click <a href="${url}">Here</a> to Verify your account</p>`
                    }
                    transporter.sendMail(mailOptions, (err,info) => {
                        if(err){
                            console.log(err)
                           return res.status(500).send(err.message)
                        }
                        let token = createJWTToken({...results[0]})
                        // console.log(token)
                        res.status(200).send({
                            status : 'Success',
                            data : {
                                ...results[0],
                                token
                            },
                            message : 'Account Created!'
                        })
                    })
                })
            }
        })
    },
    Login : (req,res) => {
        let { username, password } = req.body;
        let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
        let sql = `select id, username, roleId, email, password, verified from users where username = '${username}' and password = '${hashPassword}'`;
        db.query(sql, (err,results) => {
            if(err){
                console.log(err)
                return res.status(500).send(err.message)
            }
            if(results.length !== 0){
                // console.log(results[0])
                let token = createJWTToken({...results[0]})
                // console.log(token)

                res.status(200).send({
                    status : 'Success',
                    data : {
                        ...results[0],
                        token
                    },
                    message : 'Login Successful'
                })
            }else{
                res.status(404).send({
                    status : 'Not Found',
                    message : 'User not Found'
                })
            }
        })
    },
    keepLogin : (req,res) => {
        // console.log(req)
        res.status(200).send({
            status : 'Success',
            data : {
                ...req.user,
                token : req.token
                
            },
            message : 'Authorized'
        })
    },
    emailVerification : (req,res) => {
        let { username, password } = req.body;
        let sql = `select * from users where username = '${username}' and password = '${password}'`;
        db.query(sql, (err,results) => {
            if(err){
                res.status(500).send({
                    status : 'error',
                    message : err.message
                })
            }
            if(results.length !== 0){
                // console.log(results[0])
                let sql = `update users set verified = 1 where id =${results[0].id}`;
                db.query(sql, (err, update) => {
                    if(err){
                        res.status(500).send(err.message)
                    }
                    res.status(200).send({
                        status : 'Updated',
                        data : true,
                        message : 'User verified'
                    })
                })
            }else{
                res.status(404).send({
                    status : 'Not Found',
                    message : 'Verification Failed'
                })
            }
        })
    },
    changePicture : async (req,res) => {
        try{
            const path = '/images/display_picture';
            const upload = uploader(path, 'TDO').fields([{ name : 'image' }]) //TDD1231231 TDO123123123
            upload(req,res, async(err) => {
                const { image } = req.files;
                const { id } = req.params;
                const profilePicture = image ? `${path}/${image[0].filename}` : null
                // console.log(image)
                let sql = `select profilePicture from users where id = ${id}`
                let oldPicture = await db.query(sql)

                sql = `UPDATE users set profilePicture ='${profilePicture}' WHERE id=${id}`;
                db.query(sql, (err,results) => {
                    if(err){
                        if(profilePicture){
                            fs.unlinkSync(`./public${profilePicture}`)
                        }
                        res.status(500).send(err.message)
                    }
                    if(oldPicture[0].profilePicture){
                        fs.unlinkSync(`./public${oldPicture[0].profilePicture}`)
                    }
                    res.status(201).send({
                        status : 'created',
                        message : 'Data Created!' 
                    })
                })
            })
        }catch(err){
            res.status(500).send(err.message)
        }
    },
    fetchDataUsers : async(req,res) => {
        try{
            let { id } = req.params;
            let sql = `SELECT * FROM users WHERE id=${id}`;
            let users = await db.query(sql)
            // JOIN WITH PHONE NUMBERS
            sql = `SELECT * FROM phone_numbers WHERE userId =${id}`;
            let number = await db.query(sql)
            users[0].phoneNumbers = number
            // JOIN WITH ADDRESS
            sql = `SELECT * FROM addresses WHERE userId = ${id}`;
            let address = await db.query(sql)
            users[0].address = address           
            res.status(200).send({
                status : 'Success',
                data : users[0],
                message : 'Success'
            })
        }catch(err){
            res.status(500).send(err.message)
        }
    },
    fetchTransHistory : async(req,res) => {
        try{
            let { id } = req.params;
            let sql = `SELECT * FROM transaction WHERE userId= ${id}`;
            var users = await db.query(sql);
            for(i = 0; i<users.length ; i++){
                sql = `SELECT * FROM ipet.transaction_item iti JOIN cart c on iti.id = c.id JOIN products p ON p.id = c.productId WHERE transactionId = ${users[i].id}`;                
                let cart = await db.query(sql)
                users[i].products = cart
                for(j = 0 ; j < users[i].products.length ; j++){
                    sql = `SELECT * FROM product_image pi JOIN products p ON pi.productId = p.id  WHERE p.id= ${users[i].products[j].id}`;
                    let result = await db.query(sql)
                    users[i].products[j].image = result
                }
            }
        
           res.status(200).send({
               statuss : 'Success',
               data : users,
               message : 'Success'
           })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    addAddress : async(req,res) => {
        let { address, userId } = req.body;
        let sql = `INSERT INTO addresses (address, userId) values("${address}","${userId}")`;
        try{
            let respond = await db.query(sql);
            res.status(200).send({
                status : "created",
                message : "Data has been created"
            })
        }
        catch(err){
            res.status(500).send(err.message)
        }
    },
    deleteAddress : async(req,res) => {
        let { id } = req.params;
        let sql = `DELETE FROM addresses WHERE id=${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'deleted',
                message : 'Data Deleted!' 
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    editAddress : async(req,res) => {
        let { address } = req.body;
        let { id } = req.params;
        let sql = `UPDATE addresses set address= '${address}' WHERE id= ${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'edited',
                message : 'Data Edited!' 
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    changePassword : async(req,res) => {
        let { newPassword } = req.body;
        let { id } = req.params;
        let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(newPassword).digest('hex');
        let sql = `UPDATE users set password='${hashPassword}' WHERE id=${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'Changed',
                message : 'Password has been changed' 
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    fetchAllUsers : async(req,res) => {
        try{
           let sql = `SELECT * FROM users WHERE roleId = 2`
           let users = await db.query(sql);
           // JOIN ADDRESS
           sql = `SELECT * FROM addresses`;
           let address = await db.query(sql);
           sql = `SELECT * FROM phone_numbers`;
           let phoneNumbers = await db.query(sql)
           for(i = 0 ; i <users.length ; i++){
               users[i].address = []
               for(j = 0 ; j <address.length ; j ++) {
                   if(users[i].id === address[j].userId){
                       users[i].address.push(address[j])
                   }
               }
           }
           for(i = 0 ; i<users.length ; i++){
               users[i].phoneNumbers = []
               for(j = 0 ; j < phoneNumbers.length ; j++){
                   if(users[i].id === phoneNumbers[j].userId){
                       users[i].phoneNumbers.push(phoneNumbers[j])
                   }
               }
           }
            res.status(200).send({
                statuss : 'Success',
                data : users,
                message : 'Success'
            })
        }
        catch(err){
            res.status(500).send(err.message)
        }
    },
    hexPass : async(req, res) => {
        try{
            let { password } = req.body
            let hashPassword = Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
            res.status(200).send({hashPassword})
        }
        catch(err){
            res.status(500).send(err.message)

        }
    },
    banUser : async(req, res) => {
        // console.log('banUser')
        let { id } = req.params
        let sql = `UPDATE users set status = 1 WHERE id=${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'Changed',
                message : 'Users just got banned' 
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    unbanUser : async(req, res) => {
        // console.log('unbanUser')
        let { id } = req.params
        let sql = `UPDATE users set status = 0 WHERE id=${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'Unban',
                message : 'Users just got unbanned' 
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    addPhone : async(req,res) => {
        let { phoneNumber, userId } = req.body;
        let sql = `INSERT INTO phone_numbers (phoneNumber, userId) values("${phoneNumber}","${userId}")`;
        try{
            let respond = await db.query(sql);
            res.status(200).send({
                status : "created",
                message : "Data has been created"
            })
        }
        catch(err){
            console.log(err)
            res.status(500).send(err.message)
        }
    },
    deletePhone : async(req,res) => {
        let { id } = req.params;
        let sql = `DELETE FROM phone_numbers WHERE id=${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'deleted',
                message : 'Data Deleted!' 
            })
        }
        catch(err){
            res.status(500).send(err.message)
        }
    },
    editPhone : async(req,res) => {
        let { phoneNumber } = req.body;
        let { id } = req.params;
        let sql = `UPDATE phone_numbers set phoneNumber= '${phoneNumber}' WHERE id= ${id}`;
        try{
            let respond = await db.query(sql);
            res.status(201).send({
                status : 'edited',
                message : 'Data Edited!' 
            })
        }
        catch(err){
            res.status(500).send(err.message)
        }
    }




};
