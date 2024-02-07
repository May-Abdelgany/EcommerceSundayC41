import { roles } from "../../middleware/auth.js"
const cartEndPoints = {
    create: [roles.User],
    update: [roles.User],
}
export default cartEndPoints