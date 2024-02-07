import mongoose, { Schema, Types, model } from 'mongoose'
const brandSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'name must be unique value'],
        trim: true
    },
    image: {
        type: Object,
        required: [true, 'image is required'],
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        unique: [true, 'slug must be unique value'],
        trim: true
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
})




const brandModel = mongoose.model.Brand || model('Brand', brandSchema)


export default brandModel

