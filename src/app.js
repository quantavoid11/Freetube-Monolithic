import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/channel.routes.js"
import playlistRouter from "./routes/playlist.routes.js";
import commentRouter from "./routes/coment.routes.js";
import channelRouter from "./routes/channel.routes.js";
import path from "path";

const app=express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', 'views');

const allowedRoutes = [
    "/api/v1/users",
    "/api/v1/channels",
    "/api/v1/playlists",
    "/api/v1/comments"
];

app.use((req, res, next) => {
    if (!allowedRoutes.includes(req.path)) {
        res.status(404).render('404', { allowedRoutes });
    } else {
        next();
    }
});

app.use("/api/v1/users",userRouter);

app.use('/api/v1/channels',channelRouter);

app.use('/api/v1/playlists',playlistRouter);

app.use('/api/v1/comments',commentRouter);


export default app;