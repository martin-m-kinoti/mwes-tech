const express = require('express');
const Message = require('../models/Message');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// List conversations (one per distinct conversationId)
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$body' },
          lastSenderName: { $first: '$senderName' },
          lastSenderId: { $first: '$senderId' },
          lastMessageAt: { $first: '$createdAt' },
          participants: { $addToSet: '$senderId' },
          totalMessages: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    return res.status(200).json({ conversations });
  } catch (err) {
    console.error('List conversations error:', err);
    return res.status(500).json({ message: 'Could not load conversations.' });
  }
});

// Fetch the full thread for a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({ messages });
  } catch (err) {
    console.error('List messages error:', err);
    return res.status(500).json({ message: 'Could not load messages.' });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { conversationId, body } = req.body;

    if (!conversationId || !body?.trim()) {
      return res
        .status(400)
        .json({ message: 'conversationId and body are required.' });
    }

    const senderName = [req.user.firstName, req.user.lastName]
      .filter(Boolean)
      .join(' ') || req.user.email;

    const message = await Message.create({
      conversationId,
      senderId: req.user.email,
      senderName,
      body: body.trim(),
    });

    return res.status(201).json({ message });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ message: 'Could not send message.' });
  }
});

// Mark conversation as read
router.patch('/conversations/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Message.updateMany(
      { conversationId },
      { $set: { read: true } }
    );
    return res.status(200).json({ message: 'Conversation marked as read.' });
  } catch (err) {
    console.error('Mark read error:', err);
    return res.status(500).json({ message: 'Could not update read state.' });
  }
});

module.exports = router;