import jwt from 'express-jwt'



const jwtVeify = {
    secret:process.env.JWT_SECRET,
    credentialsRequired: false,
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }else if(req.body && req.body.token){
            return req.body.token;
        }
        return null;
    }
}

const unlessPath = ['loginByGoogle' , 'loginByMagic'].map(p=>`/api/${p}`)

export default jwt(jwtVeify).unless(unlessPath)