import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { paginate } from "../../../utils/pagination.js";
import { ApiFeatures } from "../../../utils/apiFetuers.js";
//1-get categoryId ,subCategoryId,brandId
//2-create slug
//3-finalPrice calc  500-50%=(500*50)/100=250=500-250 ==>price-((price*discount)/100)
//4-create customId
//5-upload main image
//6-check if subImage exist -->upload
//7-req.body-->createdBy

export const createProduct = asyncHandler(
    async (req, res, next) => {

        const { categoryId, subCategoryId, brandId, price, discount } = req.body
        if (!await categoryModel.findById({ _id: categoryId })) {
            return next(new Error("invalid category id", { cause: 404 }))
        }
        if (!await subCategoryModel.findById({ _id: subCategoryId, categoryId })) {
            return next(new Error("invalid subCategoryId id", { cause: 404 }))
        }
        if (!await brandModel.findById({ _id: brandId })) {
            return next(new Error("invalid brandId id", { cause: 404 }))
        }

        req.body.slug = slugify(req.body.name, {
            trim: true,
            lower: true
        })
        //==>price-((price*discount)/100)
        req.body.finalPrice = price - (price * discount || 0) / 100

        req.body.customId = nanoid()
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/mainImage` })
        if (!secure_url) {
            return next(new Error("image not found", { cause: 400 }))
        }
        req.body.mainImage = { public_id, secure_url }

        if (req.files.subImage.length) {
            let images = []
            for (const image of req.files.subImage) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
                if (!secure_url) {
                    return next(new Error("image not found", { cause: 400 }))
                }
                images.push({ secure_url, public_id })
            }
            req.body.subImages = images
        }

        req.body.createdBy = req.user._id
        const product = await productModel.create(req.body)
        return res.json({ messag: "done", product })
    }
)

//1-productId  -->find product exist
//2-subcategoryId-->find if subCategory exist
//3-brandId-->find if brand exist
//4-name -->slug
//5- (price ||discount ||(price and discount))-->finalPrice
//6-main image 
//7-subImage
//8-updated by





export const updateProduct = asyncHandler(
    async (req, res, next) => {
        const { productId } = req.params

        const product = await productModel.findById({ _id: productId })
        if (!product) {
            return next(new Error("invalid product id", { cause: 404 }))
        }
        // if (req.body.subCategoryId) {
        //     if (!await subCategoryModel.findById({ _id: req.body.subCategoryId })) {
        //         return next(new Error("invalid subCategoryId id", { cause: 404 }))
        //     }
        // }

        if (req.body.subCategoryId && !await subCategoryModel.findById({ _id: req.body.subCategoryId })) {
            return next(new Error("invalid subCategoryId id", { cause: 404 }))
        }
        if (req.body.brandId && !await brandModel.findById({ _id: req.body.brandId })) {
            return next(new Error("invalid brandId id", { cause: 404 }))
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name, {
                trim: true,
                lower: true
            })
        }
        //==>price-((price*discount)/100)
        // if (req.body.price && req.body.discount) {
        //     req.body.finalPrice = req.body.price - (req.body.price * req.body.discount) / 100
        // } else if (req.body.price) {
        //     req.body.finalPrice = req.body.price - (req.body.price * product.discount || 0) / 100
        // } else if (req.body.discount) {
        //     req.body.finalPrice = product.price - (product.price * req.body.discount) / 100
        // }

        req.body.finalPrice = req.body.price || product.price - (req.body.price || product.price * req.body.discount || product.discount || 0) / 100

        if (req.files?.mainImage?.length) {

            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}/mainImage` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
            }
            await cloudinary.uploader.destroy(product.mainImage.public_id)
            req.body.mainImage = { public_id, secure_url }
        }

        if (req.files?.subImage?.length) {

            for (const image of req.files.subImage) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` })
                if (!secure_url) {
                    return next(new Error("image not found", { cause: 400 }))
                }
                product.subImages.push({ secure_url, public_id })
            }
            req.body.subImages = product.subImages
        }

        req.body.updateBy = req.user._id
        const update = await productModel.findByIdAndUpdate({ _id: productId }, req.body, { new: true })
        return res.json({ messag: "done", update })
    }
)

//pagination -->complete
//filter     -->complete
//sort       -->complete
//fields     -->complete
//search     -->complete

export const allProducts = asyncHandler(
    async (req, res, next) => {
        // let { page, size } = req.query
        // const { limit, skip } = paginate(page, size)
        // const products = await productModel.find({}).limit(limit).skip(skip)


        // console.log(req.query);//==500 //>500 //<500 //>=500 //<=500

        //search,fields,page,size,skip,sort
        // let filter = { ...req.query }
        // console.log(filter);
        // console.log(filter['page']);
        // let excludeQueryParams = ['page', 'size', 'fields', 'skip', 'sort', 'search']
        // excludeQueryParams.forEach((element) => {
        //     delete filter[element]
        // })
        // console.log(filter);
        // filter = JSON.parse(JSON.stringify(filter).replace(/(gt|lt|gte|lte|eq|ne|nin|in)/g, (match) => `$${match}`))
        // let mongooseQuery = productModel.find(filter)
        // mongooseQuery = mongooseQuery.limit(limit)
        // mongooseQuery = mongooseQuery.skip(skip)
        // const products = await mongooseQuery
        //const products = await productModel.find(filter).limit(limit).skip(skip)
        // const products = await productModel.find({}).sort('stock')
        // console.log(req.query);
        // let products
        // if (req.query.sort) {
        //     products = await productModel.find({}).sort(req.query.sort.replaceAll(',', ' '))
        // }


        // let products
        // if (req.query.fields) {
        //     products = await productModel.find({}).select(req.query.fields.replaceAll(',', ' '))
        // }

        // const products = await productModel.find({
        //     $or: [
        //         { name: { $regex: req.query.search } },
        //         { description: { $regex: req.query.search } }
        //     ]
        // })

        const apiFeature = new ApiFeatures(productModel.find(), req.query)
            .paginate()
            .filter()
            .sort()
            .search()
            .fields()
        const products = await apiFeature.mongooseQuery
        return res.status(200).json({ message: "done", products })
    }
)


export const oneProduct = asyncHandler(
    async (req, res, next) => {
        const product = await productModel.findById({ _id: req.params.productId })
        return res.status(200).json({ message: "done", product })
    }
)