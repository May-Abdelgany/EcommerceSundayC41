import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";
export const signUpSchema = joi.object({
    userName: joi.string().min(2).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: joi.string().valid(joi.ref('password')).required(),
    file: generalFields.file,
    phone: joi.string(),
}).required()

export const loginSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password,
}).required()


export const tokenSchema = joi.object({
    token: joi.string().required()
}).required()

export const sendCodeSchema = joi.object({
    email: generalFields.email
}).required()


export const forgetPasswordSchema = joi.object({
    email: generalFields.email,
    code:joi.string().pattern(new RegExp(/^\d{5}$/)).required(),
    password: generalFields.password,
    cPassword: joi.string().valid(joi.ref('password')).required(),
}).required()
