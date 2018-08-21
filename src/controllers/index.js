import authRouter from './auth'
import fileRouter from './file'
import designTokenRouter from './design-token'
import componentRouter from './component'
import layerRouter from './layer'

export default function registerRouter(app) {
    authRouter(app)
    fileRouter(app)
    designTokenRouter(app)
    componentRouter(app)
    layerRouter(app)
}