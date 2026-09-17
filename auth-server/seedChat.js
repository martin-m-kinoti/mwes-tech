const Message = require('./models/Message');

const SEED_DATA = [
  {
    conversationId: 'client:user1',
    senderId: 'user1',
    senderName: 'User1',
    body: "Hi, I need help setting up a data analytics dashboard for my store.",
  },
  {
    conversationId: 'client:user1',
    senderId: 'admin',
    senderName: 'You',
    body: "Sure! Share your email and we'll schedule an onboarding call.",
  },
  {
    conversationId: 'client:user1',
    senderId: 'user1',
    senderName: 'User1',
    body: "Great, will do. Thanks!",
  },
  {
    conversationId: 'client:user2',
    senderId: 'user2',
    senderName: 'User2',
    body: "Is the cyber security audit included in the starter plan?",
  },
  {
    conversationId: 'client:user2',
    senderId: 'admin',
    senderName: 'You',
    body: "Hi User2, the starter plan covers a baseline security review.",
  },
  {
    conversationId: 'client:user3',
    senderId: 'user3',
    senderName: 'User3',
    body: 'When is my website redesign deadline again?',
  },
  {
    conversationId: 'client:user4',
    senderId: 'user4',
    senderName: 'User4',
    body: 'Can we switch the progress reports to weekly?',
  },
  {
    conversationId: 'client:user5',
    senderId: 'user5',
    senderName: 'User5',
    body: 'Payment went through — please confirm receipt.',
  },
  {
    conversationId: 'client:user6',
    senderId: 'user6',
    senderName: 'User6',
    body: 'Just checking in on the billing dashboard access.',
  },
  {
    conversationId: 'client:user7',
    senderId: 'user7',
    senderName: 'User7',
    body: 'Do you offer ongoing maintenance after launch?',
  },
];

async function seedChatData() {
  if (process.env.NODE_ENV === 'production') return;

  const count = await Message.estimatedDocumentCount();
  if (count > 0) return;

  await Message.insertMany(SEED_DATA);
  console.log('Seeded MongoDB with sample chat data');
}

module.exports = seedChatData;