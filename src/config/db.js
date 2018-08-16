import mongoose from 'mongoose'
import Promise from 'bluebird'

const url = process.env.DB_URL

mongoose.Promise = Promise
function initDB(app) {
    mongoose.connect(url)
    mongoose.connection.once('open' , function () {
        console.log('db connect')
        app.emit('ready')
    })
}
export default initDB