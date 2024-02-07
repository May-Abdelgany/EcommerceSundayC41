import { Router } from "express";
import * as userController from './controller/user.controller.js'
import * as userEndPoints from './user.endPoint.js'
import auth from "../../middleware/auth.js";

const router = Router()




router.patch('/addToWishlist/:productId', auth(userEndPoints.add), userController.addToWishlist)

router.patch('/removeFromWishlist/:productId', auth(userEndPoints.remove), userController.removeFromWishlist)





export default router