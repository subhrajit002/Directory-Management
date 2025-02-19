import { Router } from "express"
import { login, register } from "../controllers/auth.controller.js"
import { userProfile } from "../controllers/user.controller.js"
import userAuthenticate from "../middleware/userAuthenticate.middleware.js"

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/profile").get(userAuthenticate, userProfile)


export default router