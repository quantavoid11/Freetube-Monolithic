import { Router } from "express";
import {
  addToPlaylist,
  changePassword, createPlaylist, getPlaylistById, getPlaylists,
  getUser,
  loginUser,
  logoutUser,
  registerUser, removeFromPlaylist, updateAvatar, updateCoverImage,
  updateUser,
} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";

const router=Router();

router.route('/register')
      .post(
        upload.fields([
          {
            name:"avatar",
            maxCount:1
          },
          {
            name:"coverImage",
            maxCount:1

          }
        ]),
        registerUser)

router.route('/login')
      .post(loginUser)

router.use(authenticate);
router.route('/logout')
      .post(logoutUser)

router.route('/change-password')
      .post(changePassword)

router.route('/user')
    .get(getUser)

router.route('/update-user')
    .patch(updateUser)

router.route('/avatar')
  .patch(upload.single("avatar"),updateAvatar)

router.route('/cover-image')
  .patch(upload.single("coverImage"),updateCoverImage)




export default router;