const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://social-media-ethnus-git-main-ishaan-mishras-projects-2feb93c2.vercel.app/', // ✅ replace with your Vercel URL
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error:", err));

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const feedRoutes = require('./routes/feedRoutes');
app.use('/api/feed', feedRoutes);


app.use(cors({
  origin: "http://localhost:3000", // React dev server
  credentials: true
}));