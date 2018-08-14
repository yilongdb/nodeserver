const mongoose = require('mongoose')
const url = process.env.DB_URL


function initDB(app) {
    mongoose.connect(url)
    mongoose.connection.once('open' , function () {
        console.log('db connect')
        app.emit('ready')
    })
}
export default initDB