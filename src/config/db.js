import mongoose from 'mongoose'
import Promise from 'bluebird'
import logger from '../utils/logger'


let url = ''
let dbName = `nodeserver-${process.env.NODE_ENV}`
switch (process.env.NODE_ENV) {
    case 'test':{
        url = process.env.DB_URL_TEST

        break
    }
    case 'production':{
        url = process.env.DB_URL
        break
    }
    default:{
        url = process.env.DB_URL_DEV
        break
    }

}
mongoose.Promise = Promise

// async function initDB(app) {
//     await mongoose.connect(url, {autoIndex: false ,useNewUrlParser: true} /* avoid  warn :  DeprecationWarning:
//      current URL string
//    parser is deprecated, and will be removed in a future version. To use the
// new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
// */)
//
//
//     mongoose.connection.once('open', function () {
//         logger.info('db connect')
//         app.emit('ready')
//     })
// }{autoIndex: false ,useNewUrlParser: true}

 function initDB(app) {
     //使用 docker部署的时候 , mogodb 的port必须map为27017
     const options = {
         // dbName
     }
     mongoose.connect(url,  options , function(error) {
         if(error){
             console.log(`connect to mongodb error , env : ${process.env.NODE_ENV} , url : ${url}`)
         }
     })

    mongoose.connection.once('open', function () {
        logger.info('db connect')
        app.emit('ready')
    })

}

export default initDB