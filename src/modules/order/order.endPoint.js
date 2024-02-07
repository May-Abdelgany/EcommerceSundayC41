import { roles } from "../../middleware/auth.js"

const orderEndPoints = {
    create: [roles.User],
    cancel: [roles.User],
    deliverd: [roles.User]
}

export default orderEndPoints