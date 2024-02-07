import { Router } from "express";
import validation from "../../middleware/validation.js";
import orderEndPoints from "./order.endPoint.js";
import auth from "../../middleware/auth.js";
import * as orederValidation from './order.validation.js'
import * as orderController from './controller/order.controller.js'
const router = Router()




router.post('/',
    validation(orederValidation.tokenSchema, true),
    validation(orederValidation.createOrderSchema),
    auth(orderEndPoints.create),
    orderController.createOrder
)
router.patch(
    '/:orderId/canceld',
    validation(orederValidation.tokenSchema, true),
    validation(orederValidation.cancelOrderSchema),
    auth(orderEndPoints.cancel),
    orderController.cancelOrder
)

// router.patch(
//     '/:orderId/rejected',
//     validation(orederValidation.tokenSchema, true),
//     validation(orederValidation.cancelOrderSchema),
//     auth(orderEndPoints.cancel),
//     orderController.cancelOrder
// )

router.patch(
    '/:orderId/deliverd',
    validation(orederValidation.tokenSchema, true),
    validation(orederValidation.cancelOrderSchema),
    auth(orderEndPoints.deliverd),
    orderController.deliverdOrder
)



export default router