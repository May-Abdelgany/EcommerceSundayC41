import { roles } from "../../middleware/auth.js"

const userEndPoints = {
    add: [roles.User],
    remove: [roles.User],
}

export default userEndPoints