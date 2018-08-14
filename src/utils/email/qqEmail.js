import nodemailer from "nodemailer"


const config = {
    host: 'smtp.qq.com',
    secureConnection: true,
    port: 465,
    secure: true,
    auth:{
        user: '2974105336@qq.com',
        //需要在qq邮箱的设置里面开启ssl和smtp功能 , pass是发送码
        pass: 'urddliawhzyxdggb'
    }
}
const transporter = nodemailer.createTransport(config)

export const sendMail = async (from, to, subject, html) => {
    const mailOptions = {
        from,
        to,
        subject,
        html,
        generateTextFromHtml: true
    }
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })
}
