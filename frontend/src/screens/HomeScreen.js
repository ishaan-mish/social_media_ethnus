import React, { useEffect, useState } from 'react';
import '../cssStyles/HomeScreen.css';
import FeedImage from '../components/FeedImage';

function HomeScreen() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          alert("Please login again.");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/feed/${userId}`);
        const data = await res.json();
        setFeed(data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="home-scroll-container">
      <div className="home-feed-wrapper">
        {feed.length === 0 ? (
          <div className="empty-feed-message">No posts yet from followed users.</div>
        ) : (
          feed.map(post => (
            <div key={post._id} className="post-feed-item">
              <FeedImage post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
