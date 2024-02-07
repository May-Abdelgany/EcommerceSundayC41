import joi from 'joi'
import { generalFields } from '../../utils/generalFields.js'
export const tokenSchema = joi.object({
    authorization: joi.string().required()
}).required()

export const addToCart = joi.object({
    productId: generalFields._id,
    quantity: joi.number().min(1).positive().integer().required()
}).required()


export const deleteFromCart = joi.object({
    productId: generalFields._id,
}).required()
