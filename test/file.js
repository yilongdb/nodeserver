import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import User from '../src/models/user'
import server from '../src/main'
import {createToken} from "../src/utils/token";
import File from "../src/models/file";

const assert = chai.assert
const expect = chai.expect
const should = chai.should()

const testEmail = '2099979030@qq.com'
const authKey = 'authorization'
let authHeader = ''
let userId = ''
chai.use(chaiHttp)



describe('File routes' , ()=>{
    before(async ()=>{
        const data = {
            email:testEmail
        }

        const token = await createToken(data)
        authHeader = `Bearer ${token}`
    })

    beforeEach(async ()=>{
        await User.remove()
        await File.remove()
    })

    describe('/GET file' , ()=>{
        it('it should GET all the files' , async () => {
            const data = {
            }

            const res = await chai.request(server)
                .get('/api/files')
                .set(authKey , authHeader)
                .send(data)

            should.not.equal(res , null)
            res.should.have.status(200)
            res.body.should.be.a('object').have.property('files').that.is.a('array').is.empty
        })
    })

    describe('/POST file' , ()=>{
        it('it should POST a file' , async () => {
            let user = new User({
                email:testEmail,
                isGoogle:false
            })
            user = await user.save()

            const name = 'testfiletitle'

            const data = {
                ownerID:user.id,
                name
            }

            const res = await chai.request(server)
                .post('/api/file')
                .type('form')
                .set(authKey , authHeader)
                .send(data)

            should.not.equal(res , null)
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('ownerID').that.is.equal(user.id)
            res.body.should.have.property('name').that.is.equal(name)
        })
    })


    describe('/GET/:id file' , ()=>{
        it('it should GET a file by the given id' , async () =>{
            let user = new User({
                email:testEmail,
                isGoogle:false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID:user.id,
                name
            })

            file = await file.save()

            const res = await chai.request(server)
                .get(`/api/file/${file.id}`)
                .set(authKey , authHeader)
                .send({})

            should.not.equal(res , null)
            res.should.have.status(200)
            res.should.be.a('object')

            res.body.should.include({_id:file.id , ownerID:user.id , isDeleted:false,name})
        })
    })



    describe('/DELETE/:id file' , ()=>{
        it('it should DELETE a file given the id' , async ()=>{
            let user = new User({
                email:testEmail,
                isGoogle:false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID:user.id,
                name
            })

            file = await file.save()


            const res = await chai.request(server)
                .delete(`/api/file/${file.id}`)
                .set(authKey , authHeader)
                .send({})

            should.not.equal(res , null)
            res.should.have.status(200)
            res.should.be.a('object')

            res.body.should.have.property('isDelete').that.is.true

            file = await File.findById(file.id)
            should.equal(file , null)
        })
    })



    describe('/PUT/:id file' , ()=>{
        it('it should UPDATE a file given the id' , async ()=>{
            let user = new User({
                email:testEmail,
                isGoogle:false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID:user.id,
                name
            })

            file = await file.save()
            const newName = 'newNamewsdfsdfdsf'
            const data = {
                name:newName
            }
            const res = await chai.request(server)
                .put(`/api/file/${file.id}`)
                .set(authKey , authHeader)
                .send(data)

            should.not.equal(res , null)
            res.should.have.status(200)

            res.body.should.have.property('file').include({_id:file.id , ownerID:user.id , isDeleted:false,name:newName})
        })


        it('it should not update a file without file id' , async ()=>{
            let user = new User({
                email:testEmail,
                isGoogle:false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID:user.id,
                name
            })

            file = await file.save()
            const newName = 'newNamewsdfsdfdsf'
            const data = {
                name:newName
            }
            const res = await chai.request(server)
                .put(`/api/file/dsfsd`)
                .set(authKey , authHeader)
                .send(data)

            should.not.equal(res , null)

            res.should.have.status(400)
            res.body.should.have.property('message').that.equal('file id is need')
        })
    })

})