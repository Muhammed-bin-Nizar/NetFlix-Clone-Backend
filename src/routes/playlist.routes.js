import { Router } from "express";
import { validateJWT } from "../middlewares/auth.middleware.js";
import {
    addVideoToPlayList,
    createPlayList,
    getPlaylistVideos,
    removeVideoFromPlaylist,
    getUserPlaylists
} from "../controllers/playlist.controllers.js";


const router = Router()

router.route("/")
    .post(validateJWT, createPlayList)
    .get(validateJWT,getUserPlaylists)

// router.route("/:userId")
//     .get(getUserPlaylists)//validate jwt can be removed

router.route("/:playlistId/video/:videoId")
            .post(validateJWT, addVideoToPlayList)
            .delete(validateJWT,removeVideoFromPlaylist)

router.route("/:playlistId").get(getPlaylistVideos)

export default router