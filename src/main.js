// import 'regenerator-runtime/runtime'
// import 'babel-polyfill'
import './config'
import logger from './utils/logger'
import applyMiddles from './middles'
import {MongoError} from 'mongodb'
import './utils/email/qqEmail'

const app = applyMiddles(app)




app.use(function handleDatabaseError(error, req, res, next) {
    if (error instanceof MongoError) {
        return res.status(503).json({
            type: 'MongoError',
            message: error.message
        });
    }
    next(error);
});
app.use(function(err, req, res, next){
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('invalid token...');
    }
    logger.error(err.stack)
    const isDev = process.env.NODE_ENV === 'development'
    const error = {
        message : err.message || '500 - Server Error'
    }
    if(isDev){
        error.stack = err.stack
    }
    res.status(err.status || 500)
    res.json(error)
})
app.use(function(req, res){
    res.type('text/plain')
    res.status(404)
    res.send("404 error")
})
app.on('ready' , function () {
    app.listen(app.get('port'), function(){
        logger.info( 'Express started on http://localhost:' +
            app.get('port') + ' press Ctrl-C to terminate.' )
    })
})

process.on('exit' , function () {
    console.log('app exit')
})
//for test
export default app