import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';
import { Types } from 'mongoose';

/**
 * GET All Users /users
 * @returns an array of Users
*/
export const getAllUsers = async(_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET User based on id /user/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const thought = await User.findById(userId);
      if(thought) {
        res.json(thought);
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  /**
 * POST User /users
 * @param object username
 * @returns a single User object
*/
export const createUser = async (req: Request, res: Response) => {
  const { username, email } = req.body;
  try {
      const newUser = await User.create({
          username,
          email,
      });
      res.status(201).json(newUser);
  } catch (error: any) {
      res.status(400).json({
          message: error.message
      });
  }
};

/**
 * PUT User based on id /users/:id
 * @param object id, username
 * @returns a single User object
*/
export const updateUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string 
*/
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId});
      
      if(!user) {
        res.status(404).json({
          message: 'No user with that ID'
        });
      } else {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and thoughts deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  export const addFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;

    try {
        // Validate if userId and friendId are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
            res.status(400).json({ message: 'Invalid user ID or friend ID' });
            return;
        }

        // Ensure the user and friend exist
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            res.status(404).json({ message: 'User or friend not found' });
            return;
        }

        // Check if the friend is already added
        if (user.friends.includes(friend.id)) {
            res.status(400).json({ message: 'Friend already added' });
            return;
        }

        // Add friendId to user's friends array
        user.friends.push(friend.id);
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params;

  try {
      // Validate if userId and friendId are valid ObjectIds
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
          res.status(400).json({ message: 'Invalid user ID or friend ID' });
          return;
      }

      // Ensure the user and friend exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
          res.status(404).json({ message: 'User or friend not found' });
          return;
      }

      // Check if the friend is in the user's friends list
      const friendIndex = user.friends.indexOf(friend.id);

      if (friendIndex === -1) {
          res.status(400).json({ message: 'Friend not found in the user\'s friends list' });
          return;
      }

      // Remove friendId from user's friends array
      user.friends.splice(friendIndex, 1);
      await user.save();

      res.json({ message: 'Friend removed successfully', user });
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
};