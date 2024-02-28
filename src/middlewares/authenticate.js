import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const authenticate=asyncHandler(async(req,res,next)=>{

      const token=req.cookies?.accessToken ;
      if(!token){
        throw new ApiError(401,"User unauthorized");
      }
      const decodePayload=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      const user=await User.findById(decodePayload?._id).select("-password -refreshToken");
      if(!user){
        throw new ApiError(401,"Invalid Token Access");
      }
      req.user=user;
      next();

  })
