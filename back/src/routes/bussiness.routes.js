import { Router } from "express"
import { addBusiness, deleteBusiness, editBusiness, getUserBusiness, searchBusiness, viewAllBusiness } from "../controllers/user.controller.js"
import userAuthenticate from "../middleware/userAuthenticate.middleware.js"

const router = Router()

router.route("/createbusiness").post(userAuthenticate, addBusiness)
router.route("/updatebusiness/:id").put(userAuthenticate, editBusiness)
router.route("/userbusiness").get(userAuthenticate, getUserBusiness)
router.route("/deletebusiness").delete(userAuthenticate, deleteBusiness)
router.route("/allbusiness").get(viewAllBusiness)
router.route("/searchbusiness").get(searchBusiness)


export default router