import mongoose, { Schema, Types, model } from 'mongoose'
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        lowercase: true,
        min: 3,
        max: 30
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        trim: true,
        lowercase: true
    },
    mainImage: {
        type: Object,
        required: [true, 'image is required'],
    },
    subImages: [{
        type: Object,
    }],
    description: String,
    colors: [String],
    size: [String],
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'stock is required'],
    },
    finalPrice: {
        type: Number,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is required']  //change true when create user
    },
    brandId: {
        type: Types.ObjectId,
        ref: 'Brand',
        required: [true, 'brand is required']  //change true when create user
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'categoryId is required']  //change true when create user
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: 'SubCategory',
        required: [true, 'subCategory is required']  //change true when create user
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    customId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const productModel = mongoose.model.Product || model('Product', productSchema)

export default productModel

