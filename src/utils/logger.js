import winston from 'winston'
import {red} from 'colors'
const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf, colorize  ,prettyPrint } = format
import winstonMongoDb from 'winston-mongodb'

// const myFormat = printf(info => {
//     return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
// })

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const MongoDBLogger = winstonMongoDb.MongoDB

const logger = winston.createLogger({
    level:'info',
    // format: winston.format.json(),
    format: combine(
        label({ label: 'My Label' }),
        timestamp(),
        myFormat,
        prettyPrint()
    ),
    transports: [
        new winston.transports.File({ filename: 'nodeserver-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log'  , level:'info'}),
        new MongoDBLogger({db:process.env.LOGGER_DB_URL}),
        new winston.transports.Console({
            timestamp:true,
            level: 'silly'
        })
    ]
})

console.log('logger init')
export default logger

// winston.add(winston.transports.File , {
//     filename:'nodeserver.log',
//     level:'error'
// })
//
// winston.add(db , {
//     db:process.env.LOGGER_DB_URL
// })