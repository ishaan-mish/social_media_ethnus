const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/feed/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followedUserIds = user.following;

    const latestPosts = [];

    for (let id of followedUserIds) {
      const latestPost = await Post.findOne({ user: id })
        .populate('user', 'username userid profilePic')
        .sort({ createdAt: -1 });

      if (latestPost) latestPosts.push(latestPost);
    }

    // Optional: Sort all returned posts by createdAt
    latestPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(latestPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
