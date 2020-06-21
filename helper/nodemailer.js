const nodemailer = require('nodemailer');


//NODE MAILER STILL ERROR
const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    secure : true,
    auth : {
        user : 'artharf@gmail.com',
        pass : 'mhbpmqqhxxtnemnf'
        
    },
    tls : {
        rejectUnauthorized : false
    }
});

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'shadiqalifauzi.info@gmail.com',
//         pass: 'mjamtvzseounvhty'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })


module.exports = transporter;