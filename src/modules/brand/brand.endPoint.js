import { roles } from "../../middleware/auth.js"

const brandEndPoints = {
    create: [roles.Admin],
    update: [roles.Admin],

}

export default brandEndPoints