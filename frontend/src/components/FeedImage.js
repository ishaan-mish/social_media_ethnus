import React from "react";
import "../cssStyles/PostImage.css";
import PostContent from "./PostContent";
import { Link } from 'react-router-dom';


const FeedImage = ({ post }) => {
  if (!post) return null;

  return (
    <div className="feed-image-container">
      {/* Post Header with Profile Info */}
      <div className="post-header">
        <img 
          src={post.user.profilePic || "https://via.placeholder.com/100"} 
          alt={post.user.username}
          className="profile-pic-home"
        />
        <div className="user-info">
          <Link to={`/profile/${post.user._id}`} className="username">
            {post.user.username}
          </Link>
          <p className="userid">@{post.user.userid}</p>
        </div>
      </div>

      {/* Post Image, Caption, Likes, Comments */}
      <PostContent post={post} />
    </div>
  );
};

export default FeedImage;
