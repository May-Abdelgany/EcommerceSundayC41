import joi from 'joi'
import { generalFields } from '../../utils/generalFields.js'
export const getBrandSchema = joi.object({
    brandId: generalFields.id
}).required()

export const createBrandSchema = joi.object({
    name: joi.string().max(20).min(3).trim().required(),
    file: generalFields.file.required()
}).required()


export const updateBrandSchema = joi.object({
    brandId: generalFields.id,
    name: joi.string().max(20).min(3).trim(),
    file: generalFields.file
}).required()

export const tokenSchema = joi.object({
    authorization: joi.string().required()
}).required()
