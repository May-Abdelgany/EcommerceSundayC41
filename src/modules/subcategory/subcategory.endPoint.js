import { roles } from "../../middleware/auth.js"

const subCategoryEndPoints = {
    create: [roles.Admin],
    update: [roles.Admin],
}

export default subCategoryEndPoints