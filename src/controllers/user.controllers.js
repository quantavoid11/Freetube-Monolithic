import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const generateAccessAndRefreshToken=async(id)=>{
   try{
       const user=await User.findById(id);
       const accessToken= user.generateAccessToken();
       const refreshToken=user.generateRefreshToken();
       user.refreshToken=refreshToken;
       await user.save();
       return {accessToken,refreshToken};
   }
   catch(error){
       throw new ApiError(500, "Something went wrong while generating refresh and access token");
   }
}
export const registerUser=asyncHandler(async(req,res)=>{
    console.log("listening");
    const {username,email,name,password}=req.body;
    if([username,name,email,password].some(field=>!field || field?.trim()==="")){
        throw new ApiError(400,"ALl fields are required");
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    });
    if(existedUser){
        throw new ApiError(409,"User with this username or email already exists")
    }

    const avatarPath=req.files?.avatar[0]?.path;

    let coverImagePath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImagePath=req.files.coverImage[0].path;
    }

    if(!avatarPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar=await uploadOnCloudinary(avatarPath);
    const coverImage=await uploadOnCloudinary(coverImagePath);

    // if(!avatar){
    //     throw new ApiError(400,"Avatar is required")
    // }

    const user=await User.create({
        username:username.toLowerCase(),
          email,
          name,
          avatar:avatar.url,
        coverImage:coverImage?.url||"",
          password
    })

    const createdUser=await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          {user:createdUser},
          "User created successfully"
        )
      )
});

export const loginUser=asyncHandler(async (req,res)=>{

    const {username,email,password}=req.body;
    if(!username && !email){
        throw new ApiError(400,"Username or email is required");
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist");
    }
    const isPasswordValid=await user.checkPassword(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Credentials");
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const loggedUser=await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }
    return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new ApiResponse(
          200,
          {user:loggedUser},
          "User logged in successfully"
        )
      )
});

export const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
      req.user._id,
      {
          $set:{
          refreshToken:""
          }
      },
      {new:true}
)
    const options={
        httpOnly:true,
        secure:true
    }
    return res
      .status(200)
      .cookie("accessToken",options)
      .cookie("refreshToken",options)
      .json(
        new ApiResponse(
          200,
          {},
          "User logged out successfully"
        )
      )
});

export const changePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;

    const user=await User.findById(req.user?._id);

    const isPasswordCorrect=await user.checkPassword(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Enter Correct Password");
    }

    user.password=newPassword;
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Password changed successfully"))

});

export const getUser=asyncHandler(async(req,res)=>{
    const user=req.user;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          "User fetched successfully"))
})

export const updateUser=asyncHandler(async(req,res)=>{
    const { email,username }=req.body;
    if(!username && !email){
        throw new ApiError(400, "All fields are required")
    }
    const updatedUser=await User.findByIdAndUpdate(req.user?._id, { email,username },{new:true}).select("-password -refreshToken");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "User updated successfully"))
});
export const updateAvatar=asyncHandler(async (req,res)=>{
        const avatarPath=req.files?.avatar;
        if(!avatarPath){
            throw new ApiError(400,"Avatar file is required");
        }

    const avatarOld=req.user.avatar;
        //Todo- Delete old image
    const avatar=await uploadOnCloudinary(avatarPath);

    if(!avatar.url){
        throw new ApiError(400,"Error while updating avatar")
    }
    const user=await  User.findByIdAndUpdate(req.user?._id,{avatar:avatar?.url},{new:true}).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          "Avatar updated successfully"
        )
      );

})

export const updateCoverImage=asyncHandler(async(req,res) =>{
    const coverImagePath=req.files?.avatar;
    if(!coverImagePath){
        throw new ApiError(400,"CoverImage file is required");
    }

    const coverImageOld=req.user.coverImage;
    //Todo- Delete old image
    const coverImage=await uploadOnCloudinary(coverImagePath);

    if(!coverImage.url){
        throw new ApiError(400,"Error while updating cover image")
    }
    const user=await  User.findByIdAndUpdate(req.user?._id,{coverImage:coverImage?.url},{new:true}).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          "CoverImage updated successfully"
        )
      );
});

export const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params;

    if(!username?.trim()){
        throw new ApiError(400,"Username is not provided");
    }

    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"Subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as:"subscribed"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedCount:{
                    $size:"$subscribed"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }

            }
        },
        {
            $project:{
                name:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1
            }
        }
    ]);

    if(!channel?.length){
        throw new ApiError(404,"Channels don't exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channel[0],
          "User's channel fetched successfully"
        )
      );
});

export const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        name:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0].watchHistory,
          "User's watch history fetched successfully"
        )
      );

})

