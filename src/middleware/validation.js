

const validation = (schema, includeToken = false) => {
    return (req, res, next) => {
        let inputData = { ...req.body, ...req.params, ...req.query }
        if (req.file) {
            inputData.file = req.file
        }
        if (req.files) {
            inputData.files = req.files
        }
        if (req.headers.authorization && includeToken) {
            inputData = { authorization: req.headers.authorization }
        }
        const validationResult = schema.validate(inputData, { abortEarly: false })
        if (validationResult.error) {
            req.validationResult = validationResult.error
            return next(new Error('validationError', { cause: 400 }))
        }
        next()
    }
}

export default validation