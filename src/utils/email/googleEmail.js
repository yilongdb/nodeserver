import nodemailer from 'nodemailer'
import {google} from 'googleapis'
const OAuth2 = google.auth.OAuth2
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID ,
    process.env.GOOGLE_SECRET ,
    "https://developers.google.com/oauthplayground"
    )
let refresh_token = "1/3uh0dV3-nIUWnFnrSByzCkgBgjJ9w_i4Llpi7a15waQ"
oauth2Client.setCredentials({
    refresh_token
})
let accessToken = "ya29.Glv4BdEPXB66MIdJlSwg-FM_QLc0-pqQ8uq-mrU0fkDaZ_n7lVpNHn1j_CseOEP6rJwNSA0Gr1gneCR9NlIvGx0sVdOL5o1L7tuGVfaKTQbc7Pr_-brdAKIyWuYX"

oauth2Client.on('tokens' , tokens => {
    if(tokens.refresh_token){
        refresh_token = tokens.refresh_token
    }
    accessToken = tokens.access_token
})
// oauth2Client.refreshAccessToken(function (err , tokens) {
//     console.log('get accessToken token')
//     accessToken = tokens.access_token
// })

// oauth2Client.eagerRefreshThresholdMillis


// const mailTransport = nodemailer.createTransport('SMTP' , {
//     host:'smtp.gmail.com',
//     pool:true,
//     port:587,
//     auth:{
//         user:process.env.GMAIL_ACCOUNT,
//         pass:process.env.GMAIL_PW,
//     }
// })
const auth = {
    type: 'OAuth2',
    user: process.env.GMAIL_ACCOUNT,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    refreshToken:refresh_token,
    accessToken
}
const mailTransport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:auth
})


export const sendMail = async (from , to , subject , html) =>{
    return new Promise((resolve , reject)=>{
        mailTransport.sendMail({
            from,
            to,
            subject,
            html,
            generateTextFromHtml: true
        },function (err , info) {
            if(err){
                reject(err)
            }else{
                resolve(info)
            }
        })
    })
}



