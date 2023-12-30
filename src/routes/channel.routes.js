import {Router} from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { deleteVideo, uploadVideo } from "../controllers/channel.controllers.js";
import { upload } from "../middlewares/multer.js";

const router=Router();


router.use(authenticate);

router.route("/upload")
  .post(upload.fields([
      {
        name:"videoFile",
        maxCount:1
      },
      {
        name:"thumbNail",
        maxCount: 1
      }
    ])
    ,uploadVideo);

router.route("/delete/:videoId")
  .delete(deleteVideo);



export default router;