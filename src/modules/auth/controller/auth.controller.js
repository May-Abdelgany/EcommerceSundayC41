import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/email.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { customAlphabet } from 'nanoid'
//1-نسلتم ال data
//2- check email exist 
//3-create token and refresh token and links
//4-send email
//5-hash password
//6-create user

export const signUp = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body
        if (await userModel.findOne({ email })) {
            return next(new Error('email already exist', { cause: 409 }))
        }

        const token = generateToken(
            {
                payload: { email },
                signature: process.env.SIGN_UP_SIGNATURE,
                expiresIn: 60 * 30
            }
        )

        const rf_token = generateToken(
            {
                payload: { email },
                signature: process.env.SIGN_UP_SIGNATURE,
                expiresIn: 60 * 60 * 24 * 30
            }
        )

        //http://localhost:3000/
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const rf_link = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rf_token}`

        const html = `
        <a href='${link}'>confirm email</a>
        <br/><br/>
        <a href='${rf_link}'>refresh link</a>
        `

        if (!sendEmail({ to: email, subject: 'confirm email', html })) {
            return next(new Error('invalid email', { cause: 404 }))
        }
        req.body.password = hash({ plaintext: req.body.password })
        const newUser = await userModel.create(req.body)
        return res.status(201).json({ message: "done", user: newUser._id })
    }
)

//1- get token from params
//2-verify token
//3-check if email exist -->signup
//4-if user confirmed redirect  -->login 
//5-update for user 
//6-redirect to login
export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const { email } = verifyToken({ token, signature: process.env.SIGN_UP_SIGNATURE })
        if (!email) {
            return res.redirect('https://www.linkedin.com/feed/')//signUp
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.redirect('https://www.linkedin.com/feed/')//signUp
        }
        if (user.confirmEmail) {
            return res.redirect('https://www.facebook.com/')//login
        }
        await userModel.updateOne({ email }, { confirmEmail: true })
        return res.redirect('https://www.facebook.com/')//login
    }
)

//1-get token from params
//2-verify token
//3-check if email exist
//4-check if user confirmed or not -->login
//5- create token and newLink to confirmEmail
//6-send email -->redirect to page 

export const refreshToken = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params
        const { email } = verifyToken({ token, signature: process.env.SIGN_UP_SIGNATURE })
        if (!email) {
            return res.redirect('https://www.linkedin.com/feed/')//signUp
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.redirect('https://www.linkedin.com/feed/')//signUp
        }
        if (user.confirmEmail) {
            return res.redirect('https://www.facebook.com/')//login
        }
        const newToken = generateToken(
            {
                payload: { email },
                signature: process.env.SIGN_UP_SIGNATURE,
                expiresIn: 60 * 10
            }
        )
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`

        const html = `
        <a href='${link}'>confirm email</a>
        `

        if (!sendEmail({ to: email, subject: 'confirm email', html })) {
            return next(new Error('invalid email', { cause: 404 }))
        }

        return res.send('<h1>check email</h1>')
    }
)

//1-get email and password
//2-check if email exist 
//3-check if email confirmed
//4-compare password
//5-generate token and refresh token 
//6-update status of user



export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body
        const emailExist = await userModel.findOne({ email })
        if (!emailExist) {
            return next(new Error('email or password not valid', { cause: 400 }))
        }
        if (!emailExist.confirmEmail) {
            return next(new Error('please confirm email first', { cause: 400 }))
        }
        if (!compare({ plaintext: password, hashValue: emailExist.password })) {
            return next(new Error('email or password not valid', { cause: 400 }))
        }

        const token = generateToken(
            {
                payload: { email, id: emailExist._id },
                signature: process.env.TOKEN_SIGNATURE,
                expiresIn: 60 * 30
            }
        )
        const rf_token = generateToken(
            {
                payload: { email, id: emailExist._id },
                signature: process.env.TOKEN_SIGNATURE,
                expiresIn: 60 * 60 * 24 * 30
            }
        )
        await userModel.updateOne({ email }, { status: 'Online' })
        return res.json({ message: "done", token, rf_token })
    }
)


//1-get mail
//2-if email exist
//3-if confirmEmail
//4-create code unique
//5-update user by new code
export const sendCode = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body
        const emailExist = await userModel.findOne({ email })
        if (!emailExist) {
            return next(new Error('email not exist', { cause: 404 }))
        }
        if (!emailExist.confirmEmail) {
            return next(new Error('please confirm email', { cause: 400 }))
        }
        const nanoId = customAlphabet('0123456789', 5)
        const code = nanoId()
        if (!sendEmail({ to: email, subject: 'forget password', html: `<p>${code}</p>` })) {
            return next(new Error('fail to send email', { cause: 400 }))
        }
        await userModel.updateOne({ email }, { code })
        return res.status(200).json({ message: "check your email" })
    }
)

//1-get email and code
//2-check email exist
//3-check code 
//4-password -->hash -->update user (password ,code,.....)
export const forgetPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.params
        const { code, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new Error('user not exist', { cause: 404 }))
        }
        if (code != user.code) {
            return next(new Error('invalid code', { cause: 404 }))
        }
        const hashPassword = hash({ plaintext: password })
        await userModel.updateOne({ email }, { password: hashPassword, code: null, status: 'Offline' })
        return res.status(200).json({ message: "done" })
    }
) 