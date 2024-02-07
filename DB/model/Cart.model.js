import mongoose, { Schema, Types, model } from 'mongoose'
const cartSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        require: true,
        ref: 'User',
        unique: true
    },
    products: [
        {
            productId: {
                type: Types.ObjectId,
                require: true,
                ref: 'Product',
                unique: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
}, {
    timestamps: true
})

const cartModel = mongoose.model.Cart || model('Cart', cartSchema)

export default cartModel

