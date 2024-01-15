import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.model.js"
import { Like } from "../models/like.model.js";

export const likeComment=asyncHandler(async(req,res)=>{
      const commentId=req.query.commentId;
      const comment= await Comment.findById(commentId);
      if(!comment){
        throw new ApiError(404,"Comment does not exist");
      }
      const like=await Like.create({
        comment:comment,
        video:comment.video,
        likedBy:req.user?._id
      })
  return res.status(201)
    .json(
      new ApiResponse(
        201,
        {like:like},
        "Comment liked successfully"
      )
    )
})
export const unlikeComment=asyncHandler(async(req,res)=>{
  const commentId=req.query.commentId;
  const comment= await Comment.findById(commentId);
  if(!comment){
    throw new ApiError(404,"Comment does not exist");
  }
  const like=await Like.findOneAndDelete({$and:[{comment:comment},{user:req.user?._id}]});
  if(!like){
    throw new ApiError(400,"Can't unlike right now");
  }
  return res.status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Comment unliked successfully"
      )
    )
})
export const addComment=asyncHandler(async(req,res)=>{
    const content=req.body;
    const videoId=req.query.videoId;
    if(!content){
      throw new ApiError(400,"Empty comment is not allowed");
    }
    const comment=await Comment.create({
      content,
      video:videoId,
      user:req.user?._id
    });

  return res.status(201)
    .json(
      new ApiResponse(
        201,
        {comment:comment},
        "Comment added successfully"
      )
    )

})

export const removeComment=asyncHandler(async(req,res)=>{

  const commentId=req.query.commentId;
  const comment= await Comment.findOneAndDelete({$and:[{_id:commentId},{user:req.user?._id}]})
  if(!comment){
    throw new ApiError(404,"Comment does not exist");
  }

  return res.status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Comment removed successfully"
      )
    )
})

//review it
export const editComment=asyncHandler(async(req,res)=>{
  const content=req.body;
  if(!content){
    throw new ApiError(400,"Empty comment is not allowed");
  }
  const commentId=req.query.commentId;
  const comment= await Comment.findOne({$and:[{_id:commentId},{user:req.user?._id}]})
  if(!comment){
    throw new ApiError(404,"Comment does not exist");
  }

    comment.content=content;
    const updatedComment=await comment.save();
  return res.status(200)
    .json(
      new ApiResponse(
        200,
        {comment:updatedComment},
        "Comment edited successfully"
      )
    )
});

