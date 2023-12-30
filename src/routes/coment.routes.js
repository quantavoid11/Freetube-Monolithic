import {Router} from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  addComment,
  editComment,
  likeComment,
  removeComment,
  unlikeComment,
} from "../controllers/comment.controllers.js";

const router=Router();


router.use(authenticate);

router.route('/like')
  .post(likeComment)

router.route('/unlike')
  .post(unlikeComment)

router.route('/add-comment')
  .post(addComment)

router.route('/remove-comment')
  .post(removeComment)

router.route('/edit-comment')
  .patch(editComment)

export default router;