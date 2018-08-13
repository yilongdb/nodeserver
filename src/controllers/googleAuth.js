// import passport from 'passport'

/*
* {scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}
*
* {scope: ['profile', 'email']}
*
* */
// import passport from "passport/lib/index";

const registerRoutes = (app , passport) => {
    app.get('/auth/google', passport.authenticate('google',{scope: ['https://www.googleapis.com/auth/userinfo.profile']}))
    app.get('/auth/google/callback', passport.authenticate('google',
        {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        })
}


export default registerRoutes