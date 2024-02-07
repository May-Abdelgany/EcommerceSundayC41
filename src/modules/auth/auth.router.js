import { Router } from "express";
import validation from "../../middleware/validation.js";
import * as authController from './controller/auth.controller.js'
import * as authValidation from './auth.validation.js'
const router = Router()
router.post(
    '/signUp',
    validation(authValidation.signUpSchema),
    authController.signUp
)
    .post(
        '/login',
        validation(authValidation.loginSchema),
        authController.login
    )
    .get(
        '/confirmEmail/:token',
        validation(authValidation.tokenSchema),
        authController.confirmEmail
    )
    .get(
        '/refreshToken/:token',
        validation(authValidation.tokenSchema),
        authController.refreshToken
    )
    .patch(
        '/sendCode',
        validation(authValidation.sendCodeSchema),
        authController.sendCode
    )
    .put(
        '/forgetPassword/:email',
        validation(authValidation.forgetPasswordSchema),
        authController.forgetPassword
    )
export default router