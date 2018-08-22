import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import User from '../../src/models/user'
import File from "../../src/models/file"
import Layer from "../../src/models/layer"
import DesignToken from '../../src/models/design-token'
import Component from '../../src/models/component'
import server from '../../src/main'
import {createToken} from "../../src/utils/token";
import {clearDBTest} from "../utils";

const ObjectId = mongoose.Types.ObjectId
const assert = chai.assert
const expect = chai.expect
const should = chai.should()
const testEmail = '2099979030@qq.com'
const authKey = 'authorization'
let authHeader = ''
let userId = ''
chai.use(chaiHttp)


describe('File routes', () => {
    before(async () => {
        const data = {
            email: testEmail
        }

        const token = await createToken(data)
        authHeader = `Bearer ${token}`
    })





    beforeEach(async () => {
        await clearDBTest()
    })


    describe('/GET file', () => {
        it('it should GET all the files', async () => {
            const data = {}

            const res = await chai.request(server)
                .get('/api/files')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(200)
            res.body.should.be.a('object').have.property('files').that.is.a('array').is.empty
        })
    })

    describe('/POST file', () => {
        it('it should POST a file', async () => {
            let user = new User({
                email: testEmail,
                isGoogle: false
            })
            user = await user.save()

            const name = 'testfiletitle'

            const data = {
                ownerID: user.id,
                name
            }

            const res = await chai.request(server)
                .post('/api/file')
                .type('form')
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.have.property('ownerID').that.is.equal(user.id)
            res.body.should.have.property('name').that.is.equal(name)
        })
    })


    describe('/GET/:id file', () => {
        it('it should GET a file by the given id : contains components , designtokens , layers', async () => {
            let user = new User({
                email: testEmail,
                isGoogle: false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID: (user.id),
                name
            })

            file = await file.save()

            let designToken = new DesignToken({
                fid: (file.id),
                name: 'design token',
                value: 'deisgn token value',
                type: 'BoX'
            })
            designToken = await designToken.save()

            let cName = 'component name'
            let lName = 'layer name'

            for (let i = 0; i < 5; i++) {
                let component = new Component({
                    fid: (file.id),
                    name: `${cName}-${i}`
                })
                component = await component.save()
                for (let j = 0; j < 5; j++) {
                    if (i == 2) {
                        break
                    }
                    let layer = new Layer({
                        name: `${lName}-${i}-${j}`,
                        type: 'Box',
                        cid: (component.id),
                        parentID: null,
                        styles: 'styles'
                    })

                    await layer.save()
                }
            }


            const res = await chai.request(server)
                .get(`/api/file/${file.id}`)
                .set(authKey, authHeader)
                .send({})

            should.not.equal(res, null)
            res.should.have.status(200)
            res.should.be.a('object')
            res.body.should.include({_id: file.id, ownerID: user.id, name})

            res.body.should.have.property('components')
                .that.is.a('array').lengthOf(5, 'components length  should be 5')
                .that.nested
                .property('[0].layers')
                .is.a('array').have.lengthOf(5, 'layers length  should be 5')

            res.body.should
                .nested.property('components[2].layers')
                .is.a('array').have.lengthOf(0, 'layers length  should be 0')

            res.body.should
                .nested.property('designTokens')
                .that.is.a('array').lengthOf(1, 'designTokens length  should be 1')
                .property('[0]').include({
                fid: file.id,
                name: 'design token',
                value: 'deisgn token value',
                type: 'box'
            })

        })
    })


    describe('/DELETE/:id file', () => {
        let user, file
        beforeEach(async () => {
            user = new User({
                email: testEmail,
                isGoogle: false
            })
            user = await user.save()

            const name = 'testfiletitle'

            file = new File({
                ownerID: (user.id),
                name
            })

            file = await file.save()
        })
        it('it should DELETE a file given the id , and delete component , designtoken , layer', async () => {
            let designToken = new DesignToken({
                fid: (file.id),
                name: 'design token',
                value: 'deisgn token value',
                type: 'BoX'
            })
            designToken = await designToken.save()

            let cName = 'component name'
            let lName = 'layer name'

            for (let i = 0; i < 5; i++) {
                let component = new Component({
                    fid: (file.id),
                    name: `${cName}-${i}`
                })
                component = await component.save()
                for (let j = 0; j < 5; j++) {
                    if (i == 2) {
                        break
                    }
                    let layer = new Layer({
                        name: `${lName}-${i}-${j}`,
                        type: 'Box',
                        cid: (component.id),
                        parentID: null,
                        styles: 'styles'
                    })

                    await layer.save()
                }
            }


            const res = await chai.request(server)
                .delete(`/api/file/${file.id}`)
                .set(authKey, authHeader)
                .send({})

            // console.log(res)
            should.not.equal(res, null)

            res.should.have.status(200)
            res.should.be.a('object')

            res.body.should.have.property('isDelete').that.is.true

            let dFile = await File.findById(file.id)
            should.equal(dFile, null)

            let component = await Component.find({fid:file.id})

            component.should.be.a('array').is.empty

            let layer = await Layer.find()
            layer.should.be.a('array').is.empty

            let dt = await DesignToken.find({fid:file.id})

            dt.should.be.a('array').is.empty
        })
    })


    describe('/PUT/:id file', () => {
        it('it should UPDATE a file given the id', async () => {
            let user = new User({
                email: testEmail,
                isGoogle: false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID: user.id,
                name
            })

            file = await file.save()
            const newName = 'newNamewsdfsdfdsf'
            const data = {
                name: newName
            }
            const res = await chai.request(server)
                .put(`/api/file/${file.id}`)
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)
            res.should.have.status(200)

            res.body.should.have.property('file').include({
                _id: file.id,
                ownerID: user.id,
                isDeleted: false,
                name: newName
            })
        })


        it('it should not update a file without file id', async () => {
            let user = new User({
                email: testEmail,
                isGoogle: false
            })
            user = await user.save()

            const name = 'testfiletitle'

            let file = new File({
                ownerID: user.id,
                name
            })

            file = await file.save()
            const newName = 'newNamewsdfsdfdsf'
            const data = {
                name: newName
            }
            const res = await chai.request(server)
                .put(`/api/file/dsfsd`)
                .set(authKey, authHeader)
                .send(data)

            should.not.equal(res, null)

            res.should.have.status(400)
            res.body.should.have.property('message').that.equal('file id is need')
        })
    })

})