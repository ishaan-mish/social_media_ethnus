import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssStyles/styles.css';

function PostScreen() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Social_media"); // ✅ Your preset
  formData.append("cloud_name", "dnrsmjsix"); // ✅ Your cloud name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dnrsmjsix/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setImagePreview(data.secure_url); // ✅ Actual hosted image URL
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Image upload failed.");
  }
};


  const handlePost = async () => {
    if (!imagePreview || caption.trim() === '') {
      alert('Image and caption required');
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) {
      alert("User not logged in. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          imageUrl: imagePreview,
          caption
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Post created:", data);
        navigate("/home");
      } else {
        alert(data.error || "Failed to post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Left: Image preview */}
        <div style={styles.left}>
          <label style={styles.label}>Select Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />

          {imagePreview ? (
            <img src={imagePreview} alt="Preview" style={styles.preview} />
          ) : (
            <div style={styles.placeholder}>Image preview will appear here</div>
          )}
        </div>

        {/* Right: Caption + Button */}
        <div style={styles.right}>
          <h2 style={styles.heading}>Create a Post</h2>

          <label style={styles.label}>Caption</label>
          <textarea
            placeholder="Write something amazing..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={handlePost} style={styles.button}>Post</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#EEEEF6',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    marginTop: 50,
    background: '#fff',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: '1000px',
    maxWidth: '100%',
    height: '500px'
  },
  left: {
    flex: 1,
    padding: '20px',
    borderRight: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column'
  },
  right: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '6px',
    fontWeight: 'bold'
  },
  fileInput: {
    marginBottom: '15px'
  },
  preview: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  placeholder: {
    background: '#eee',
    borderRadius: '8px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontStyle: 'italic',
    fontSize: '14px'
  },
  heading: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '20px'
  },
  textarea: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    resize: 'none',
    minHeight: '150px',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#7354AF',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s'
  }
};

export default PostScreen;
