
import slugify from "slugify"
import categoryModel from "../../../../DB/model/Category.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"



//1-check if name exist   -->name exist
//                       -->continue
//2-upload image in cloud
//3-create slug
//4-create category with 

export const createCategory = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        if (await categoryModel.findOne({ name })) {
            return next(new Error("name already exist", { cause: 409 }))
        }
        //step 2
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))
        }
        req.body.image = { public_id, secure_url }
        //step 3
        req.body.slug = slugify(name)
        //step 4
        req.body.createdBy = req.user._id
        const category = await categoryModel.create(req.body)
        return res.status(201).json({ message: "Done", category })
    }
)


//1-findAll categories

export const allCategories = asyncHandler(
    async (req, res, next) => {
        const categories = await categoryModel.find().populate([
            {
                path: 'subCategory'
            }
        ])
        return res.status(200).json({ message: "done", categories })
    }
)

//1-get id of category
//2-find category of id


export const getCategory = asyncHandler(
    async (req, res, next) => {
        const { categoryId } = req.params
        const category = await categoryModel.findById({ _id: categoryId }).populate([
            {
                path: 'subCategory'
            }
        ])
        return res.status(200).json({ message: "done", category })
    }

)
//1-find category if exist
//2-if update name  ==>name not exist before 
//3-if ubdate image  -->update image delete old image from cloud
//4-update category


export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const { categoryId } = req.params
        const categoryExist = await categoryModel.findById({ _id: categoryId })
        if (!categoryExist) {
            return next(new Error("iinvalid category id", { cause: 404 }))

            // return res.status(404).json({ message: "invalid category id" })
        }

        if (req.body.name) {
            if (await categoryModel.findOne({ name: req.body.name })) {
                return next(new Error("name already exist", { cause: 409 }))

                // return res.status(409).json({ message: "name already exist" })
            }
            req.body.slug = slugify(req.body.name)
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
                // return res.status(400).json({ message: "image not found" })
            }

            await cloudinary.uploader.destroy(categoryExist.image.public_id)
            req.body.image = { public_id, secure_url }
        }
        req.body.updatedBy = req.user._id
        const newCategory = await categoryModel.findByIdAndUpdate({ _id: categoryId }, req.body, { new: true })
        return res.status(200).json({ message: "done", category: newCategory })

    }
)