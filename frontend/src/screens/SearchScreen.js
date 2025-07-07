import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to search users.");
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔍 Search</h1>

      <div style={styles.searchBarContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or @userid..."
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} style={styles.button}>Search</button>
      </div>

      <div style={styles.resultsContainer}>
        {results === null ? (
          <p style={styles.placeholder}>Start typing to search for users.</p>
        ) : results.length === 0 ? (
          <p style={styles.noResult}>No users found.</p>
        ) : (
          results.map(user => (
            <div
              key={user._id}
              style={styles.userCard}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={user.profilePic || "https://via.placeholder.com/100"}
                alt={user.username}
                style={styles.avatar}
              />
              <div>
                <div style={styles.username}>{user.username}</div>
                <div style={styles.userid}>@{user.userid}</div>
                <div style={styles.bio}>{user.bio || "No bio available."}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    minHeight: '100vh',
    padding: '30px 20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '28px',
    color: '#5e35b1',
    marginBottom: '20px'
  },
  searchBarContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#7e57c2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  resultsContainer: {
    marginTop: '10px'
  },
  placeholder: {
    color: '#888',
    fontStyle: 'italic'
  },
  noResult: {
    color: '#d32f2f',
    fontWeight: 'bold'
  },
  userCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    marginBottom: '15px',
    backgroundColor: '#f3e5f5',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  username: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  userid: {
    color: '#7e57c2',
    fontSize: '14px',
    marginBottom: '5px'
  },
  bio: {
    fontSize: '14px',
    color: '#555'
  }
};

export default SearchScreen;
