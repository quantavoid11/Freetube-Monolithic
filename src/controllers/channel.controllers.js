import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadVideo=asyncHandler(async(req,res)=>{
      const {title,description,duration}=req.body;
      if(!title || !description || !duration){
        throw new ApiError(400,"ALl fields are required");
      }

      const videoFilePath=req.files?.videoFile?.[0].path;
      const thumbNailPath=req.files?.thumbNail?.[0].path;
      if(!videoFilePath || !thumbNailPath ){
        throw new ApiError(400,"Video file and thumbnail are required");
      }

      const videoFile=await uploadOnCloudinary(videoFilePath);
      const thumbNail=await uploadOnCloudinary(thumbNailPath);

      if(!videoFile){
        throw new ApiError(400,"Error while uploading video");
      }
      if(!thumbNail){
        throw new ApiError(400,"Error while uploading thumbnail");
      }

      const video=await Video.create({
        videoFile:videoFile.url,
        thumbNail:thumbNail.url,
        title,
        description,
        duration,
        owner:req.user?._id
      });

      const uploadedVideo=await Video.findById(video._id);

  if(!uploadedVideo){
    throw new ApiError(500, "Something went wrong while uploading the video");
  }

      return res.status(201)
        .json(
          new ApiResponse(
            201,
            { video:video },
            "Video uploaded successfully"

          )
        )
})

export const deleteVideo=asyncHandler(async(req,res)=>{
        const videoId=req.params.id;

        const video=await Video.findByIdAndDelete(videoId);
        if(!video){
          throw new ApiError(400,"Some error occurred while deleting the video");
        }
        return res.status(200)
            .json(
              new ApiResponse(
                200,
                {},
                "Video deleted successfully"
              )
            )
})