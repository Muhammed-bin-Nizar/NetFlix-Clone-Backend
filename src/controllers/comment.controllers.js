import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAllCommentsByVideoId, getByIdAndAddComment } from "../model/comment.model.js";


const createComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const commentCreated = await getByIdAndAddComment({
    content,
    video: id,
    owner: req.user?.id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, commentCreated, "Comment added successfully") // ✅ pass commentCreated
    );
});

const getAllComments = asyncHandler(async(req,res)=>{
    const {id} = req.params


    const comments = await getAllCommentsByVideoId(id)
    // console.log(comments)

    return res
            .status(201)
            .json(
                new ApiResponse(201,comments,"all Comments fetched")
            )
})


export {createComment,getAllComments}