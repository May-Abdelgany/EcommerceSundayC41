import { roles } from "../../middleware/auth.js"

const couponEndPoints = {
    create: [roles.User],
    update: [roles.User],
    

}

export default couponEndPoints