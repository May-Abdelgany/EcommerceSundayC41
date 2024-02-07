import mongoose, { Schema, Types, model } from 'mongoose'

//userId,products,address,phone,paymentTypes,totalPrice,subPrice,couponId,status,note
const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    products: [
        {
            name: {
                type: String,
                required: true,
                min: 3,
                max: 30
            },

            productId: {
                type: Types.ObjectId,
                require: true,
                ref: 'Product',
                // unique: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            //سعر القطعه الواحده من المنتج
            unitPrice: {
                type: Number,
                required: true,
                min: 1
            },
            //سعر القطعه * الكميه
            totalPrice: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    address: {
        type: String,
        required: true
    },
    phone: {
        type: [String],
        required: true
    },
    paymentTypes: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    //السعر بعد استخدام الكوبون
    finalPrice: {
        type: Number,
        required: true,
        min: 1
    },
    //السعر قبل استخدام الكوبون
    subPrice: {
        type: Number,
        required: true,
        min: 1
    },
    note: String,
    couponId: {
        type: Types.ObjectId,
        ref: 'Coupon'
    },
    status: {
        type: String,
        enum: ['placed', 'onWay', 'cancel', 'rejected', 'deliverd', 'waitForPayment'],
        default: 'placed'
    },
    reson: String,
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})
// mongoose.model.Order ||
const orderModel = model('Order', orderSchema)

export default orderModel

