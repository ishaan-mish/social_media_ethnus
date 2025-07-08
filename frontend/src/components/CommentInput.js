import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { FaRegCommentDots } from 'react-icons/fa';

function CommentInput({ postId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
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
    <div className="comment-input-container" style={{ padding: '16px', borderTop: '1px solid #e0e0e0' }}>
      <div className="comment-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '1px solid #ddd', borderRadius: '25px', padding: '8px 16px' }}>
        <div className="react-icon" ><FaRegCommentDots size={20} color="#61DAFB" /></div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', padding: '8px 0' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="boost-btn" 
          disabled={loading}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          {loading ? '...' : <IoSend size={18} color="#4CAF50" />}
        </button>
      </div>
    </div>
  );
}

export default CommentInput;