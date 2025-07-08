import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../cssStyles/ProfileScreen.css';
import PostImage from '../components/PostImage';
import { fetchSinglePost } from '../Api/fetchSinglePost';

const ProfileScreen = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = paramUserId || currentUser?._id;

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePic: '',
    age: '',
    phone: '',
    password: ''
  });
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://your-backend-service.onrender.com/api/users/${userId}`);
        const data = await res.json();
        setProfileData(data);
        setIsFollowing(data.user.followers.includes(currentUser._id));

        // Initialize edit form
        if (currentUser._id === data.user._id) {
          setEditForm({
            username: data.user.username,
            bio: data.user.bio,
            profilePic: data.user.profilePic,
            age: data.user.age,
            phone: data.user.phone,
            password: ''
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    try {
      const res = await fetch(`https://your-backend-service.onrender.com/api/users/${currentUser._id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: userId })
      });

      const result = await res.json();
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            followers: isFollowing
              ? prev.user.followers.filter(id => id !== currentUser._id)
              : [...prev.user.followers, currentUser._id]
          }
        }));
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert("Failed to follow/unfollow user.");
    }
  };

  const handlePostClick = async (postId) => {
    const post = await fetchSinglePost(postId);
    setSelectedPost(post);
    setShowPostPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
    setShowPostPopup(false);
  };

  if (!profileData) return <div style={{ padding: 40 }}>Loading profile...</div>;

  const { user, postCount, posts } = profileData;
  const isOwnProfile = currentUser._id === user._id;

  return (
    <div className="profile-scroll-container">
      <div className="profile-container">
        <ProfileHeader
          user={user}
          postCount={postCount}
          onFollow={handleFollow}
          isFollowing={isFollowing}
          isOwnProfile={isOwnProfile}
          onEdit={() => setShowEditModal(true)} // new

        />

        <ProfileContent posts={posts} onPostClick={handlePostClick} />

        {showPostPopup && selectedPost && (
          <PostImage post={selectedPost} onClose={handleClosePopup} />
        )}
        {showEditModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Profile</h2>

      <input
        type="text"
        placeholder="Username"
        value={editForm.username}
        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
      />
      <input
        type="text"
        placeholder="Bio"
        value={editForm.bio}
        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
      />
{/* Profile Picture File Upload */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Social_media"); // 🔁 Replace
    formData.append("cloud_name", "dnrsmjsix");       // 🔁 Replace

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dnrsmjsix/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setEditForm({ ...editForm, profilePic: data.secure_url });
      alert("Image uploaded successfully");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    }
  }}
/>

      <input
        type="number"
        placeholder="Age"
        value={editForm.age}
        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        value={editForm.phone}
        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
      />
      <input
        type="password"
        placeholder="New Password (optional)"
        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
      />

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`https://your-backend-service.onrender.com/api/users/${user._id}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
              });
              const updated = await res.json();
              if (res.ok) {
                setProfileData(prev => ({ ...prev, user: updated.user }));
                alert("Profile updated");
                setShowEditModal(false);
              } else {
                alert(updated.error);
              }
            } catch (err) {
              console.error("Update failed:", err);
              alert("Error updating profile");
            }
          }}
        >
          Save Changes
        </button>
        <button onClick={() => setShowEditModal(false)} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

const ProfileHeader = ({ user, postCount, onFollow, isFollowing, isOwnProfile, onEdit }) => {
  const followerCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;

  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-pic-container">
          <img
            src={user.profilePic || '/default-avatar.png'}
            alt={user.username}
            className="profile-pic"
          />
        </div>

        <div className="profile-info">
<div className="profile-username-row">
  <h2 className="profile-username">{user.userid}</h2>

  {!isOwnProfile ? (
    <button
      className={`follow-btn ${isFollowing ? 'followed' : ''}`}
      onClick={onFollow}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  ) : (
    <button className="edit-btn" onClick={onEdit}>
      Edit Profile
    </button>
  )}
</div>


          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{postCount}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followerCount}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">following</span>
            </div>
          </div>

          <div className="profile-bio">
            <div className="profile-name-with-age">
              <span className="profile-age">{user.age}</span>
              <span className="profile-name">{user.username}</span>
            </div>
            <div className="profile-bio-text">{user.bio}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileContent = ({ posts, onPostClick }) => {
  return <PostGrid posts={posts} onPostClick={onPostClick} />;
};

const PostGrid = ({ posts, onPostClick }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="empty-posts">
        <div className="empty-posts-icon">📷</div>
        <div className="empty-posts-text">No posts yet</div>
      </div>
    );
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostGridItem key={post._id} post={post} onPostClick={onPostClick} />
      ))}
    </div>
  );
};

const PostGridItem = ({ post, onPostClick }) => {
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  return (
    <div className="post-grid-item" onClick={() => onPostClick(post._id)}>
      <img src={post.imageUrl} alt={post.caption} className="post-image" />
      <div className="post-overlay">
        <div className="post-stats">
          <div className="post-stat">
            <span className="stat-icon">♥</span>
            <span className="stat-count">{likeCount}</span>
          </div>
          <div className="post-stat">
            <span className="stat-icon">💬</span>
            <span className="stat-count">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
