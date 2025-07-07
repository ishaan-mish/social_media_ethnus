import React, { useState, useEffect, useRef } from 'react';
import CommentInput from "./CommentInput";

function PostContent({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);

  const likeRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (post?.likes && currentUser?._id) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [post, currentUser]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US');

const handleLike = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: currentUser._id })
    });

    const data = await res.json();

    if (res.ok) {
      // Use server-confirmed like count and state
      setIsLiked(data.liked);         // true or false
      setLikeCount(data.likes);       // backend validated count

      // Animate heart
      if (likeRef.current) {
        likeRef.current.classList.add('heart-animate');
        setTimeout(() => likeRef.current.classList.remove('heart-animate'), 400);
      }
    } else {
      console.warn("Like toggle failed:", data.error);
    }
  } catch (err) {
    console.error("Error toggling like:", err);
  }
};

  if (!post) return null;

  return (
    <div className="post-content-wrapper">
      {/* Left: Image + Caption */}
      <div className="post-left">
        <div className="image-container">
          <img src={post.imageUrl} alt="post" className="post-img" />
          <div
            className={`like-overlay ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            ref={likeRef}
          >
            ♥ <span>{likeCount}</span>
          </div>
        </div>

        <div className="caption-box">
          <b>{post.user?.userid || "unknown"}</b>{" "}
          <b style={{ color: '#999999', fontSize: 12 }}>
            {formatDate(post.createdAt)}
          </b>
          <div className="caption-text">{post.caption}</div>
        </div>
      </div>

      {/* Right: Comments */}
      <div className="post-right">
        <div className="comments-header">
          💬 Comments <b className="comment-count">{comments.length}</b>
        </div>

        <div className="comments-scroll">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <div className="comment-user">
                {c.user && typeof c.user === 'object'
                  ? c.user.userid
                  : typeof c.user === 'string'
                    ? `User: ${c.user.substring(0, 6)}...`
                    : 'Unknown'}
              </div>
              <div className="comment-text">{c.text}</div>
              <div className="comment-date">{formatDate(c.createdAt)}</div>
            </div>
          ))}
        </div>

        <CommentInput
          postId={post._id}
          onCommentAdded={(newComment) => setComments(prev => [...prev, newComment])}
        />
      </div>
    </div>
  );
}

export default PostContent;
