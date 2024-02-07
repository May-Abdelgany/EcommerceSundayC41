import mongoose, { Schema, Types, model } from 'mongoose'
const subCategorySchema = new Schema({
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
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'categoryId is required']  //change true when create user
    }
}, {
    timestamps: true
})

const subCategoryModel = mongoose.model.SubCategory || model('SubCategory', subCategorySchema)

export default subCategoryModel

