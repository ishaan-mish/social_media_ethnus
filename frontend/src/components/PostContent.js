import React, { useState, useEffect, useRef } from 'react';
import CommentInput from "./CommentInput";

function PostContent({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);

  const likeRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Check if user already liked post
  useEffect(() => {
    if (post?.likes && currentUser?._id) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [post, currentUser]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US');

  // Toggle like/unlike using one endpoint
  const handleLike = async () => {
    try {
      const res = await fetch(`https://your-backend-service.onrender.com/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: currentUser._id })
      });

      const data = await res.json();

      if (res.ok) {
        setIsLiked(data.liked);         // from backend true/false
        setLikeCount(data.likes);       // updated count

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

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://your-backend-service.onrender.com/api/posts/${post._id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Post deleted successfully");
        window.location.reload(); // or navigate("/profile")
      } else {
        const data = await res.json();
        alert(data.error || "Could not delete post");
      }
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Server error");
    }
  };

  if (!post) return null;

  // Check post ownership (post.user can be string or object)
  const isOwner = post.user === currentUser._id || post.user?._id === currentUser._id;

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

        {isOwner && (
          <button className="delete-post-btn" onClick={handleDeletePost}>
            🗑 Delete Post
          </button>
        )} 
        

        <div className="caption-box">
          <b>
            {post.user?.userid || (typeof post.user === 'object' ? post.user.userid : 'unknown')}
          </b>{" "}
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
