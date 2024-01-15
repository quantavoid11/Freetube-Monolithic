import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/channel.routes.js"
import playlistRouter from "./routes/playlist.routes.js";
import commentRouter from "./routes/coment.routes.js";
import channelRouter from "./routes/channel.routes.js";


const app=express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use(cookieParser());

app.use("/api/v1/users",userRouter);

app.use('/api/v1/channels',channelRouter);

app.use('/api/v1/playlists',playlistRouter);

app.use('/api/v1/comments',commentRouter);


export default app;