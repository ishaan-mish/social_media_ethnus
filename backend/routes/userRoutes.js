const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Follow a user
router.post('/:userId/follow', async (req, res) => {
  const { userId } = req.params;           // current user (from URL)
  const { targetId } = req.body;           // the user you want to follow

  try {
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent duplicate follows
    if (!currentUser.following.includes(targetId)) {
      currentUser.following.push(targetId);
      targetUser.followers.push(userId);

      await currentUser.save();
      await targetUser.save();
    }

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Unfollow a user
router.post('/:userId/unfollow', async (req, res) => {
  const { userId } = req.params;
  const { targetId } = req.body;

  try {
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove targetId from currentUser.following
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Search users by username or userid
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { userid: { $regex: query, $options: 'i' } },
      ]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile (bio and profile picture)
router.put('/:id/update', async (req, res) => {
  try {
    const { bio, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio, profilePic },
      { new: true }
    );

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const Post = require('../models/Post');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });

    res.json({
      user: user.toObject(),
      postCount: posts.length,
      posts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:userId/update', async (req, res) => {
  try {
    const updates = req.body;

    // If password is being updated, hash it
    if (updates.password) {
      const hashed = await bcrypt.hash(updates.password, 10);
      updates.password = hashed;
    }

    // Don't allow duplicate userid
    if (updates.userid) {
      const existing = await User.findOne({ userid: updates.userid });
      if (existing && existing._id.toString() !== req.params.userId) {
        return res.status(400).json({ error: 'User ID already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optionally delete all posts by this user
    await Post.deleteMany({ user: user._id });

    res.json({ message: 'User and posts deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
