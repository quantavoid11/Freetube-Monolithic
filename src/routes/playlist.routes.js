import {
  addToPlaylist,
  createPlaylist,
  getPlaylistById,
  getPlaylists,
  removeFromPlaylist,
} from "../controllers/playlist.controllers.js";
import router from "./user.routes.js";
import { authenticate } from "../middlewares/authenticate.js";


router.use(authenticate);

router.route('/')
  .get(getPlaylists)

router.route('/:playlistId')
  .get(getPlaylistById)

router.route('/create')
  .post(createPlaylist)

router.route('/addVideo')
  .post(addToPlaylist)

router.route('/removeVideo')
  .post(removeFromPlaylist)

export default router;