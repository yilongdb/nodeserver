import 'regenerator-runtime/runtime';
import passport from 'passport'
import './config'

import db from './config/db'
import express from 'express'
import initGoogleAuth from './config/auth'
import cors from 'cors'
import routers from './controllers'



import middles from './middles'
import {serveStaticFile} from "./utils/file";
import expressHandlebars from 'express3-handlebars'
import {isAuth} from "./utils/auth";
import googleRoute from './controllers/googleAuth'
import path from 'path'

import './utils/email'
const app = express();
app.use(cors())
const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
})
app.engine('handlebars' , handlebars.engine)
app.set('view engine' , 'handlebars')

app.set('views', 'src/views/')

app.set('port', process.env.PORT || 3000);
db(app)


initGoogleAuth(passport)
const rest = middles(app , passport)

routers(rest)

googleRoute(app , passport)



app.get('/' , isAuth, function (req , res , next) {
    res.render('index', {user: req.user})
})
app.get('/login' , function (req , res , next) {
    res.render('login')
})
app.get('/account' ,isAuth, function (req , res , next) {
    res.render('account')
})




// custom 404 page
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send("sdf");
});
// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.on('ready' , function () {
    app.listen(app.get('port'), function(){
        console.log( 'Express started on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.' );
    });
})
