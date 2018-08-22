//todo way createToken need regenerator-runtime
import 'regenerator-runtime/runtime'
// import 'babel-polyfill'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

export const createToken = async (payload, options = {}) => {
    const defaultOption = {expiresIn: '15d'}
    options = {...defaultOption, ...options}

    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET, options, (err, token) => {
            if (err) {
                reject('create token error')
            } else {
                resolve(token)
            }
        })
    })

}


export const verifyToken = async token => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                reject(err)
            } else {
                resolve(payload)
            }
        })
    })
}

