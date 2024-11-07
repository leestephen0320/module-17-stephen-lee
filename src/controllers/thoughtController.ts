import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';
import { Types } from 'mongoose';
import { IReaction } from '../models/Thought.js';

/**
 * GET All Thoughts /thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * GET Thought based on id /thought/:id
 * @param string id
 * @returns a single Thought object
*/
export const getThoughtById = async (req: Request, res: Response): Promise<void> => {
    const { thoughtId } = req.params;

    try {
        // Validate if the provided thoughtId is a valid ObjectId
        if (!Types.ObjectId.isValid(thoughtId)) {
            res.status(400).json({ message: 'Invalid thought ID' });
            return; // Ensure the function doesn't continue after sending the response
        }

        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json(thought);
        } else {
            res.status(404).json({
                message: 'Thought not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST Thought /thoughts
 * @param object thoughtname
 * @returns a single Thought object
*/
export const createThought = async (req: Request, res: Response): Promise<void> => {
    const { thoughtText, username } = req.body;

    try {
        // Ensure the user exists before creating a thought
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return; // Ensure the function doesn't continue after sending the response
        }

        const newThought = await Thought.create({
            thoughtText,
            username,
            reactions: [] // Empty array of reactions initially
        });

        res.status(201).json(newThought);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

/**
 * PUT Thought based on id /thoughts/:id
 * @param object id, thoughtname
 * @returns a single Thought object
*/
export const updateThought = async (req: Request, res: Response): Promise<void> => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
            return; // Ensure the function doesn't continue after sending the response
        }

        res.json(thought);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

/**
 * DELETE Thought based on id /thoughts/:id
 * @param string id
 * @returns string 
*/
export const deleteThought = async (req: Request, res: Response): Promise<void> => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
            return; // Ensure the function doesn't continue after sending the response
        } else {
            res.json({ message: 'Thought deleted!' });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const addReaction = async (req: Request, res: Response): Promise<void> => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    try {
        // Validate if the thoughtId is a valid ObjectId
        if (!Types.ObjectId.isValid(thoughtId)) {
            res.status(400).json({ message: 'Invalid thought ID' });
            return;
        }

        // Find the thought by thoughtId
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }

        // Create the new reaction object and ensure it conforms to IReaction type
        const newReaction: IReaction = {
            reactionId: new Types.ObjectId(),  // Generate new ObjectId for the reaction
            reactionBody,                      // Body of the reaction
            username,                           // Username of the person reacting
            createdAt: new Date(),              // Current timestamp for createdAt
        };

        // Add the new reaction to the thought's reactions array
        thought.reactions.push(newReaction);

        // Save the updated thought document
        await thought.save();

        // Return the updated thought
        res.status(201).json(thought);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteReaction = async (req: Request, res: Response): Promise<void> => {
    const { thoughtId, reactionId } = req.params;

    try {
        // Validate if thoughtId and reactionId are valid ObjectIds
        if (!Types.ObjectId.isValid(thoughtId) || !Types.ObjectId.isValid(reactionId)) {
            res.status(400).json({ message: 'Invalid thought ID or reaction ID' });
            return; // Ensure the function doesn't continue after sending the response
        }

        // Find the thought by thoughtId
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }

        // Find the reaction to delete by reactionId
        const reactionIndex = thought.reactions.findIndex((reaction) => reaction.reactionId.toString() === reactionId);
        if (reactionIndex === -1) {
            res.status(404).json({ message: 'Reaction not found' });
            return;
        }

        // Remove the reaction from the reactions array
        thought.reactions.splice(reactionIndex, 1);

        // Save the updated thought
        await thought.save();
        res.json(thought);  // Return the updated thought
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};