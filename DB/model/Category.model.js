import mongoose, { Schema, Types, model } from 'mongoose'
const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'name must be unique value'],
        trim: true,
        lowercase: true
    },
    image: {
        type: Object,
        required: [true, 'image is required'],
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        unique: [true, 'slug must be unique value'],
        trim: true,
        lowercase: true
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


categorySchema.virtual('subCategory', {
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'categoryId'
})


const categoryModel = mongoose.model.Category || model('Category', categorySchema)


export default categoryModel

