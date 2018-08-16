import authRouter from './auth'
import fileRouter from './file'
export default function registerRouter(app) {
    authRouter(app)
    fileRouter(app)
}