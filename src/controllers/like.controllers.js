import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { checkIsLikedVideo, getByIdAndAddLike, getByIdAndRemoveLike, getVideoLikeCount } from "../model/like.models.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    //take the video id from the url parameters

    const { id } = req.params // video id


    if (!id) {
        throw new ApiError(401, "not a valid video id found")
    }

    const isLiked = await checkIsLikedVideo({
        videoId: id,
        userId: req.user?.id
    })


    if (isLiked) {
        console.log("disliking the video")
        const removeLike = await getByIdAndRemoveLike({
            videoId: id,
            userId: req.user.id
        })
        if (!removeLike) {
            throw new ApiError(500, "Unable to remove like")
        }


        return res
            .status(201)
            .json(
                new ApiResponse(201, {}, "Video Like Removed")
            )
    }

    console.log("liking the video")
    const addLike = await getByIdAndAddLike({
        videoId: id,
        userId: req.user?.id
    })

    if (!addLike) {
        throw new ApiError(500, "Unable like the video")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, {}, "Like added to the video")
        )

})


const getLikes = asyncHandler(async (req, res) => {
    const { id } = req.params

    const totalLikeCouts = await getVideoLikeCount(id)

    // console.log(totalLikeCouts)

    return res
        .status(201)
        .json(
            new ApiResponse(201, totalLikeCouts, "Likes count fetched")
        )
})

const isLiked = asyncHandler(async (req, res) => {
    const { id } = req.params
    const isLiked = await checkIsLikedVideo({
        videoId: id,
        userId: req.user?.id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, {isLiked}, "Like status fetched")
        )
})

export {
    toggleVideoLike,
    getLikes,
    isLiked
}