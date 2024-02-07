import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import subCategoryEndPoints from "./subcategory.endPoint.js";
import * as subCategoryController from './controller/subCategory.controller.js'
import * as subCategoryValidation from './subcategory.validation.js'
const router = Router({ mergeParams: true })

router
    .post('/',
        validation(subCategoryValidation.tokenSchema, true),
        auth(subCategoryEndPoints.create),
        fileUpload(fileValidation.image).single('image'),
        validation(subCategoryValidation.createSubCategorySchema),
        subCategoryController.createSubCategory
    )
    .get('/',
        subCategoryController.allSubCategories
    )
    .get('/:subCategoryId',
        validation(subCategoryValidation.getSubCategorySchema),
        subCategoryController.getSubCategory
    )
    .put('/:subCategoryId',
        validation(subCategoryValidation.tokenSchema, true),
        auth(subCategoryEndPoints.update),
        fileUpload(fileValidation.image).single('image'),
        validation(subCategoryValidation.updateSubCategorySchema),
        subCategoryController.updateSubCategory
    )

export default router