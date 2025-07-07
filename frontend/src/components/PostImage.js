import React, { useState } from "react";
import "../cssStyles/PostImage.css";
import PostContent from "./PostContent";

const PostImage = ({ post, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!post) return null;
  return (
    <div
      className="post-modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("post-modal-overlay") && onClose()
      }
    >
      <div className="post-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <PostContent post={post} />
      </div>
    </div>
  );
};

export default PostImage;
