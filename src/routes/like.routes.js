import { Router } from "express";
import { validateJWT } from "../middlewares/auth.middleware.js";
import { getLikes, isLiked, toggleVideoLike } from "../controllers/like.controllers.js";

const router = Router()


router.route("/like/:id").post(validateJWT,toggleVideoLike)
router.route("/:id").get(getLikes)
router.route("/isLiked/:id").get(validateJWT,isLiked)


export default router