import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const getPlaylists=asyncHandler(async(req,res)=>{

})
export const getPlaylistById=asyncHandler(async(req,res)=>{
        const playlistId=req.params.id;

        const playlist=await Playlist.findById(playlistId);
        if(!playlist){
          throw new ApiError(404,"Playlist does not exist");
        }
        return res.status(200)
          .json(
            new ApiResponse(
              200,
              {playlist:playlist},
              "Playlists fetched successfully"
            )
          )
})

export const createPlaylist=asyncHandler(async(req,res)=>{
      const {name,description}=req.body;
      if(!name){
        throw new ApiError(400,"Playlist name is required");
      }
      //add to check user
      const playlistExists=await Playlist.findOne({name:name});

      if(playlistExists){
        throw new ApiError(409,"Playlist with this name already exists");
      }

      const playlist=await Playlist.create({
        name,
        description: description || "",
        user:req.user?._id,
        video:[]
      });

  return res.status(200)
    .json(
      new ApiResponse(
        200,
        {playlist:playlist},
        "Playlists created successfully"
      )
    )
})
export const addToPlaylist=asyncHandler(async (req,res)=>{
    const playlistId=req.query.playlistId;
      const videoId=req.query.videoId;
      if(!playlistId || !videoId){
        throw new ApiError(400,"PlaylistId and videoId are required");
      }
})
export const removeFromPlaylist=asyncHandler(async (req,res)=>{

})