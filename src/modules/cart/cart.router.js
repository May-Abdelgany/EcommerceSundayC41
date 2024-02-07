import { Router } from "express";
import * as cartController from './controller/cart.controller.js'
import * as cartValidation from './cart.validation.js'
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import cartEndPoints from "./cart.endPoint.js";
const router = Router()
router
    .post(
        '/',
        validation(cartValidation.tokenSchema, true),
        auth(cartEndPoints.create),
        cartController.addToCart
    )
    .patch(
        '/:productId',
        validation(cartValidation.tokenSchema, true),
        auth(cartEndPoints.update),
        cartController.deleteFromCart
    )
    .patch(
        '/',
        validation(cartValidation.tokenSchema, true),
        auth(cartEndPoints.update),
        cartController.clearProductsFromCart
    )
export default router