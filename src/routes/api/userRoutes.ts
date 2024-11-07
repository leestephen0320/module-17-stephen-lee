import { Router } from 'express';
const router = Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} from '../../controllers/userController.js';

// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/:userId/friends/:friendId (Add a friend)
router.route('/:userId/friends/:friendId').post(addFriend);

// /api/users/:userId/friends/:friendId (Delete a friend)
router.route('/:userId/friends/:friendId').delete(deleteFriend);

export { router as userRoutes };
