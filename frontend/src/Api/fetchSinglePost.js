// src/Api/fetchSinglePost.js
export const fetchSinglePost = async (postId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch post");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
