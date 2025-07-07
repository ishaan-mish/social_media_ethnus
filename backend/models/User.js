const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userid: { type: String, required: true, unique: true }, // display name or handle
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' }, // URL to profile image
    phone: { type: String, default: '' },   // ✅ NEW
  age: { type: Number, default: null },   // ✅ NEW 
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
