import winston from 'winston'
import {red} from 'colors'
import util from 'util'
import winstonMongoDb from 'winston-mongodb'

const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf, colorize  ,prettyPrint } = format

const isTesting = process.env.NODE_ENV === 'test'

let url = ''

switch (process.env.NODE_ENV) {
    case 'test':{
        url = process.env.LOGGER_DB_URL_DEV
        break
    }
    case 'production':{
        url = process.env.LOGGER_DB_URL
        break
    }
    default:{
        url = process.env.LOGGER_DB_URL_DEV
        break
    }

}

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const MongoDBLogger = winstonMongoDb.MongoDB

const logger = winston.createLogger({
    level:'info',
    silent:isTesting,
    format: winston.format.json(),
    // format: combine(
    //     label({ label: 'My Label' }),
    //     timestamp(),
    //     myFormat,
    //     prettyPrint()
    // ),
    transports: [
        new winston.transports.File({ filename: 'nodeserver-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log'  , level:'info'}),
        new MongoDBLogger({db:url}),
        new winston.transports.Console({
            timestamp:true,
            level: 'silly'
        })
    ]
})

if(!isTesting){
    function formatArgs(args){
        return [util.format.apply(util.format, Array.prototype.slice.call(args))];
    }

    console.log = function(){
        logger.info.apply(logger, formatArgs(arguments));
    };
    console.info = function(){
        logger.info.apply(logger, formatArgs(arguments));
    };
    console.warn = function(){
        logger.warn.apply(logger, formatArgs(arguments));
    };
    console.error = function(){
        logger.error.apply(logger, formatArgs(arguments));
    };
    console.debug = function(){
        logger.debug.apply(logger, formatArgs(arguments));
    };
}



export default logger

