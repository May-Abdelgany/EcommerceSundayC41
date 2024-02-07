import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../../DB/model/User.model.js";

export const roles = {
    Admin: 'Admin',
    User: 'User'
}


const auth = (role = Object.values(roles)) => {

    return async (req, res, next) => {

        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return next(new Error('In-valid bearer key', { cause: 400 }))
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]

        if (!token) {
            return next(new Error('In-valid token', { cause: 400 }))
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decoded?.id) {
            return next(new Error('In-valid token payload', { cause: 400 }))
        }
        const authUser = await userModel.findById(decoded.id).select('userName email role status')
        if (!authUser) {
            return next(new Error('Not register account', { cause: 404 }))
        }
        if (authUser.status != 'Online') {
            return next(new Error('invalid token please login', { cause: 400 }))
        }
        if (!role.includes(authUser.role)) {
            return next(new Error('not authorized', { cause: 401 }))
        }
        req.user = authUser;
        return next()

    }

}

export default auth