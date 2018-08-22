import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import DesignToken from '../../src/models/design-token'
import server from '../../src/main'
import {authKey, getDesignTokenTest, getFileTest, getTokenTest, getUserTest , clearDBTest} from "../utils";

const ObjectId = mongoose.Types.ObjectId
const assert = chai.assert
const expect = chai.expect

const should = chai.should()
let authHeader = ''
let user = ''
let file = ''
chai.use(chaiHttp)


describe('Design token routes', () => {
    before(async () => {
        await clearDBTest()
        authHeader = await getTokenTest()
        user = await getUserTest()
        file = await getFileTest(user.id)
    })


    afterEach(async () => {
       await DesignToken.remove()
    })

    after(async ()=>{
        await clearDBTest()
    })
    describe('/GET design tokens', () => {
        it('it should GET all the design tokens , with length = 0', async () => {


            const res = await chai.request(server)
                .get(`/api/design-tokens?fid=${file.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('array').is.empty
        })

        it('it should not GET all the design tokens , without file id', async () => {


            const res = await chai.request(server)
                .get(`/api/design-tokens`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(400)
            res.should.nested.have.property('body.message' , 'fid is not valid')
        })

        it('it should GET all the design tokens , with array length = 5', async () => {

            const dt = []
            for(let i = 0 ; i < 5 ; i++){
                dt.push(await getDesignTokenTest(file.id))
            }
            const res = await chai.request(server)
                .get(`/api/design-tokens?fid=${file.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('array').lengthOf(5)
        })

    })

    describe('/POST design token', () => {
        it('it should POST a design token', async () => {

            const data = {
                fid : file.id,
                name: 'design token',
                value: 'deisgn token value',
                type: 'BoX'
            }

            const res = await chai.request(server)
                .post('/api/design-token')
                .type('form')
                .set(authKey, authHeader)
                .send(data)
            should.not.equal(res, null)
            res.should.have.status(200)
            data.type = data.type.toLowerCase()
            res.body.should.be.a('object').include(data)
        })

        it('it should not POST a design token for not exist file', async () => {

            const randomId = mongoose.Types.ObjectId()
            const data = {
                fid : randomId.toString(),
                name: 'design token',
                value: 'deisgn token value',
                type: 'BoX'
            }

            const res = await chai.request(server)
                .post('/api/design-token')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(400)
            res.should.nested.have.property('body.message' , 'file is not exist')
        })

        it('it should not POST a design token for error design token type', async () => {

            const data = {
                fid : file.id,
                name: 'design token',
                value: 'deisgn token value',
                type: 'errortype'
            }

            const res = await chai.request(server)
                .post('/api/design-token')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)

            res.should.have.status(500)

            res.should.nested.have.property('body.message').that.match(/^designToken validation failed: type/)
        })
    })


    describe('/DELETE/:id design token', () => {
        it('it should DELETE a design token given the id', async () => {
            let designToken = await getDesignTokenTest(file.id)


            const res = await chai.request(server)
                .delete(`/api/design-token/${designToken.id}`)
                .set(authKey, authHeader)
                .send()

            should.not.equal(res, null)

            res.should.have.status(200)
            res.body.should.have.property('isDelete').that.is.true

            designToken = await DesignToken.findById(designToken.id)
            should.equal(designToken , null)
        })
    })


    describe('/PUT/:id design token', () => {
        it('it should UPDATE a design token given the id', async () => {
            let designToken = await getDesignTokenTest(file.id)
            const data = {
                fid : file.id,
                name: 'design token modify',
                value: 'deisgn token value modify',
                type: 'texT'
            }
            const res = await chai.request(server)
                .put(`/api/design-token/${designToken.id}`)
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(200)

            res.body.should.include({
                name: data.name,
                value: data.value,
                type: data.type.toLowerCase()
            })
        })
    })

})