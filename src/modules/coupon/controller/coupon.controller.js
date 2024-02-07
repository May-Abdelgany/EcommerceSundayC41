import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCoupon = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        if (await couponModel.findOne({ name })) {
            return next(new Error("name already exist", { cause: 409 }))
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/copuon` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
            }
            req.body.image = { public_id, secure_url }
        }
        req.body.createdBy = req.user._id
        const coupon = await couponModel.create(req.body)
        return res.status(201).json({ message: "done", coupon })
    }
)



export const allCoupons = asyncHandler(
    async (req, res, next) => {
        const copuon = await couponModel.find()
        return res.status(200).json({ message: "done", copuon })
    }
)


export const getCoupon = asyncHandler(
    async (req, res, next) => {
        const { couponId } = req.params
        const coupon = await couponModel.findById({ _id: couponId })
        return res.status(200).json({ message: "done", coupon })
    }

)


export const updateCoupon = asyncHandler(
    async (req, res, next) => {
        const { couponId } = req.params
        const couponExist = await couponModel.findById({ _id: couponId })
        if (!couponExist) {
            return next(new Error("invalid coupon id", { cause: 404 }))
        }

        if (req.body.name) {
            if (await couponModel.findOne({ name: req.body.name })) {
                return next(new Error("name already exist", { cause: 409 }))
            }
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
            if (!secure_url) {
                return next(new Error("image not found", { cause: 400 }))
            }
            if (couponExist.image?.public_id) {
                await cloudinary.uploader.destroy(couponExist.image.public_id)
            }
            req.body.image = { public_id, secure_url }
        }
        req.body.updatedBy = req.user._id
        const newCoupon = await couponModel.findByIdAndUpdate({ _id: couponId }, req.body, { new: true })
        return res.status(200).json({ message: "done", coupon: newCoupon })

    }
)