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

