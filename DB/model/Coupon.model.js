import mongoose, { Schema, Types, model } from 'mongoose'
const couponSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'name must be unique value'],
        trim: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: [true, 'amount is required']
    },
    image: {
        type: Object
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is required']  //change true when create user
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expireIn: {
        type: Date,
        required: true
    },
    usedBy: [
        {
            type: Types.ObjectId,
            ref: 'User',
        }
    ]
}, {
    timestamps: true
})

const couponModel = mongoose.model.Coupon || model('Coupon', couponSchema)

export default couponModel

