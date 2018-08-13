// import passport from 'passport'
import googlePassport from 'passport-google-oauth'
import User from '../models/user'

const GoogleStrategy = googlePassport.OAuth2Strategy
const GOOGLE_CONSUMER_KEY = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CONSUMER_SECRET = process.env.GOOGLE_SECRET



export default function init(passport){
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CONSUMER_KEY,
        clientSecret: GOOGLE_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    }, function (accessToken, refreshToken, profile, done) {
        const authId = 'google' + profile.id
        const {email, name,} = profile
        const data = {
            email,
            authId,
            name: name.toString()
        }
        User.findOneAndUpdate({authId}, data, {
            new: true,
            upsert: true
        }, function (err, user) {
            return done(err, user)
        })
    }))
}