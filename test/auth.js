import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import User from '../src/models/user'
import server from '../src/main'
import {createToken} from "../src/utils/token";

const assert = chai.assert
const expect = chai.expect
const should = chai.should()

const testEmail = '2099979030@qq.com'
const authKey = 'authorization'
let authHeader = ''
chai.use(chaiHttp)



describe('Auth routes' , ()=>{
    before(async ()=>{
        const data = {
            email:testEmail
        }

        const token = await createToken(data)
        authHeader = `Bearer ${token}`
    })

    //skip google login
    xit('login by google' , done=>{


    })



    it('login by magic' , done=>{

        const data = {
            email:testEmail
        }

        chai.request(server)
            .post('/api/loginByMagic')
            .type('form')
            .send(data)
            .then(res=>{
                should.not.equal(res , null)
                res.should.have.status(200)
                res.should.be.a('object')
                res.body.should.have.property('info').eql('send email')
                done()
            }).catch(err=>{
                done(err)
            })
    })

    it('confirm magic link' , done=>{
        const data = {
            user:{
                email:testEmail
            }
        }
        chai.request(server)
            .post('/api/confirmMagicLink')
            .type('form')
            .set(authKey , authHeader)
            .send(data)
            .then(res=>{
                should.not.equal(res , null)
                res.should.have.status(200)
                res.should.be.a('object')
                res.body.should.have.property('confirm').that.to.be.true
                res.body.should.have.property('user').that.has.property('email').that.is.equal(testEmail)
                done()
            }).catch(err=>{
            done(err)
        })
    })




})