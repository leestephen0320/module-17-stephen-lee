// Static User Data
export const users = [
  {
    username: 'john_doe',
    email: 'john.doe@example.com',
    thoughts: [],  // This will be populated after thoughts are seeded
    friends: [],    // This will be populated later with friend relationships
  },
  {
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'alice_wonder',
    email: 'alice.wonder@example.com',
    thoughts: [],
    friends: [],
  },
];

// Static Thought Data with Reactions
export const thoughts = [
  {
    thoughtText: 'This is my first thought!',
    username: 'john_doe',
    reactions: [
      {
        reactionBody: 'Great thought!',
        username: 'jane_smith',
      },
      {
        reactionBody: 'I agree!',
        username: 'alice_wonder',
      },
    ],
  },
  {
    thoughtText: 'I love learning new things!',
    username: 'john_doe',
    reactions: [
      {
        reactionBody: 'Keep going!',
        username: 'alice_wonder',
      },
    ],
  },
  {
    thoughtText: 'Time to take a break.',
    username: 'jane_smith',
    reactions: [
      {
        reactionBody: 'Enjoy your break!',
        username: 'alice_wonder',
      },
      {
        reactionBody: 'Sounds nice!',
        username: 'john_doe',
      },
    ],
  },
];
