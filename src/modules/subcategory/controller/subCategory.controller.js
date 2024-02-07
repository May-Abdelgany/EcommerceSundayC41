
import slugify from "slugify"
import categoryModel from "../../../../DB/model/Category.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import subCategoryModel from "../../../../DB/model/SubCategory.model.js"


//1-cheack if category exist
//2-check if name exist   -->name exist
//                       -->continue
//3-upload image in cloud
//4-create slug
//5-create subcategory  

export const createSubCategory = asyncHandler(
    async (req, res, next) => {
        const { categoryId } = req.params
        const { name } = req.body
        if (! await categoryModel.findById({ _id: categoryId })) {
            return next(new Error("invalid category id", { cause: 404 }))
        }
        if (await subCategoryModel.findOne({ name })) {
            return next(new Error("name already exist", { cause: 409 }))
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory` })
        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))
        }
        req.body.image = { public_id, secure_url }
        req.body.slug = slugify(name)
        req.body.categoryId = categoryId
        req.body.createdBy = req.user._id
        const subCategory = await subCategoryModel.create(req.body)
        return res.status(201).json({ message: "Done", subCategory })
    }
)


//1-findAll subCategories

export const allSubCategories = asyncHandler(
    async (req, res, next) => {
        const { categoryId } = req.params
        const subCategories = await subCategoryModel.find({ categoryId }).populate([
            {
                path: 'categoryId'
            }
        ])
        return res.status(200).json({ message: "done", subCategories })
    }
)

//1-get id of subCategory
//2-find subCategory of id


export const getSubCategory = asyncHandler(
    async (req, res, next) => {
        const { subCategoryId } = req.params
        const subCategory = await subCategoryModel.findById({ _id: subCategoryId }).populate([
            {
                path: 'categoryId'
            }
        ])
        return res.status(200).json({ message: "done", subCategory })
    }

)



//1-find subctegory exist
//2-if update name  ==>name not exist before 
//3-if ubdate image  -->update image delete old image from cloud
//4-update subcategory


export const updateSubCategory = asyncHandler(
    async (req, res, next) => {
        const { subCategoryId } = req.params
        const subCategoryExist = await subCategoryModel.findById({ _id: subCategoryId })
        if (!subCategoryExist) {
            return next(new Error("iinvalid subCategory id", { cause: 404 }))
        }

        if (req.body.name) {
            if (await subCategoryModel.findOne({ name: req.body.name })) {
                return next(new Error("name already exist", { cause: 409 }))
            }
            req.body.slug = slugify(req.body.name)
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
            }
            await cloudinary.uploader.destroy(subCategoryExist.image.public_id)
            req.body.image = { public_id, secure_url }
        }
        req.body.updatedBy = req.user._id
        const newSubCategory = await subCategoryModel.findByIdAndUpdate({ _id: subCategoryId }, req.body, { new: true })
        return res.status(200).json({ message: "done", subCategory: newSubCategory })

    }
)