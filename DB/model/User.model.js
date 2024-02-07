import mongoose, { Schema, Types, model } from "mongoose";


const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: 'Offline',
        enum: ['Offline', 'Online']
    },
    gender: {
        type: String,
        default: 'Female',
        enum: ['Male', 'Female']
    },
    code: String,
    address: String,
    image: String,
    DOB: String,
    wishList: [
        {
            type: Types.ObjectId,
            ref: 'Product'
        }
    ]
}, {
    timestamps: true
})


const userModel = mongoose.model.User || model('User', userSchema)
export default userModel