import db from '../config/connection.js';
import { User, Thought } from '../models/index.js';
import cleanDB from './cleanDB.js';
import { users, thoughts } from './data.js';

try {
  await db();
  await cleanDB(); // Clean up the DB before seeding

  // Insert thoughts into the database first because we need the thought IDs for the users
  const thoughtIds = await Thought.insertMany(thoughts);
  const thoughtIdsMap = new Map(
    thoughtIds.map((thought: any) => [thought.thoughtText, thought._id])
  );

  // Update the users to associate their thoughts by the inserted thought IDs
  const usersWithThoughts = users.map(user => ({
    ...user,
    thoughts: thoughts
      .filter(thought => thought.username === user.username)
      .map(thought => thoughtIdsMap.get(thought.thoughtText)),
  }));

  // Insert users into the database
  const userData = await User.insertMany(usersWithThoughts);

  // Add friends relationships (for simplicity, manually define friendships)
  const userMap = new Map(userData.map(user => [user.username, user._id]));

  // Manually defining friend relationships, using type assertion for 'friends' as ObjectId[] to avoid errors
  (userData[0].friends as any[]).push(userMap.get('jane_smith')!, userMap.get('alice_wonder')!);  // john_doe's friends
  (userData[1].friends as any[]).push(userMap.get('john_doe')!);  // jane_smith's friend
  (userData[2].friends as any[]).push(userMap.get('john_doe')!);  // alice_wonder's friend

  // Save updated user data with friends relationships
  for (const user of userData) {
    await user.save();
  }

  console.table(userData);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
