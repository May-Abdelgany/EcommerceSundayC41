
import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"


export const createBrand = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        //step 1
        if (await brandModel.findOne({ name })) {
            return next(new Error("name already exist", { cause: 409 }))
        }
        //step 2
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brands` })
        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))
        }
        req.body.image = { public_id, secure_url }
        req.body.slug = slugify(name)
        req.body.createdBy = req.user._id
        const brand = await brandModel.create(req.body)
        return res.status(201).json({ message: "Done", brand })
    }
)




export const allBrands = asyncHandler(
    async (req, res, next) => {
        const brands = await brandModel.find()
        return res.status(200).json({ message: "done", brands })
    }
)



export const getBrand = asyncHandler(
    async (req, res, next) => {
        const { brandId } = req.params
        const brand = await brandModel.findById({ _id: brandId })
        return res.status(200).json({ message: "done", brand })
    }
)
//1-find category if exist
//2-if update name  ==>name not exist before 
//3-if ubdate image  -->update image delete old image from cloud
//4-update category


export const updateBrand = asyncHandler(
    async (req, res, next) => {
        const { brandId } = req.params
        const brandExist = await brandModel.findById({ _id: brandId })
        if (!brandExist) {
            return next(new Error("iinvalid brand id", { cause: 404 }))
        }
        if (req.body.name) {
            if (await brandModel.findOne({ name: req.body.name })) {
                return next(new Error("name already exist", { cause: 409 }))
            }
            req.body.slug = slugify(req.body.name)
        }
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brands` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
            }
            await cloudinary.uploader.destroy(brandExist.image.public_id)
            req.body.image = { public_id, secure_url }
        }
        req.body.uploadBy = req.user._id
        const newbrand = await brandModel.findByIdAndUpdate({ _id: brandId }, req.body, { new: true })
        return res.status(200).json({ message: "done", brand: newbrand })

    }
)