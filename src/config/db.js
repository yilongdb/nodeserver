import mongoose from 'mongoose'
import Promise from 'bluebird'
import logger from '../utils/logger'


let url = ''

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
// }
 function initDB(app) {
     mongoose.connect(url, {autoIndex: false ,useNewUrlParser: true} /* avoid  warn :  DeprecationWarning:
     current URL string
   parser is deprecated, and will be removed in a future version. To use the
new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
*/)


    mongoose.connection.once('open', function () {
        logger.info('db connect')
        app.emit('ready')
    })
}

export default initDB