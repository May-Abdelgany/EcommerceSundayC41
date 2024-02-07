import { Router } from "express";

import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import productEndPoints from "./product.endPoint.js";
import * as productController from './controller/product.controller.js'
import * as productValidation from './product.validation.js'
const router = Router()


router.post(
    '/',
    validation(productValidation.tokenSchema, true),
    auth(productEndPoints.create),
    fileUpload(fileValidation.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImage', maxCount: 5 }
    ]),
    validation(productValidation.createProductSchema),
    productController.createProduct
)

    .put(
        '/:productId',
        validation(productValidation.tokenSchema, true),
        auth(productEndPoints.create),
        fileUpload(fileValidation.image).fields([
            { name: 'mainImage', maxCount: 1 },
            { name: 'subImage', maxCount: 5 }
        ]),
        validation(productValidation.updateProductSchema),
        productController.updateProduct
    )
    .get(
        '/',
        productController.allProducts
    )
    .get(
        '/:productId',
        validation(productValidation.oneProductSchema),
        productController.oneProduct
    )


export default router