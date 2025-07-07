const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a post
router.post('/create', async (req, res) => {
  try {
    const { userId, imageUrl, caption } = req.body;
    const newPost = new Post({ user: userId, imageUrl, caption });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts of a user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user')               // Populate post creator info
      .populate('comments.user');     // ✅ Populate commenter info

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
      await post.save();
      return res.json({ message: 'Post unliked', liked: false, likes: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ message: 'Post liked', liked: true, likes: post.likes.length });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:postId/likes', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({ likeCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const User = require('../models/User');

// Get all posts by userid
router.get('/by-username/:userid', async (req, res) => {
  try {
    const user = await User.findOne({ userid: req.params.userid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment
// routes/postRoutes.js
router.post('/:postId/comment', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      user: userId,
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id).populate('comments.user', 'userid');

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get post with populated comments
router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments.user', 'username userid profilePic')
      .select('comments');

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
