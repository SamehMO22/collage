

import { Router } from "express";

const router = Router()




import * as controller from'./news.controller.js'
import { asyncHandler } from "../../utiles/errorhandeling.js";
import { fileUpload } from "../../utiles/multer.js";



router.post('/add'   ,fileUpload({}).single('image'),asyncHandler(controller.addnews))





export default router