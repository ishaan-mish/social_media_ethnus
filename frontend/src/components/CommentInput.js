import React, { useState } from 'react';

function CommentInput({ postId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://your-backend-service.onrender.com/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          text: text.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        onCommentAdded(data.comment);  // update parent
        setText('');
      } else {
        alert(data.error || "Failed to comment");
      }
    } catch (err) {
      console.error("Comment error:", err);
      alert("Server error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-input-container">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="comment-input"
      />
      <button type="submit" className="comment-submit-btn" disabled={loading}>
        {loading ? '...' : 'Post'}
      </button>
    </form>
  );
}

export default CommentInput;
