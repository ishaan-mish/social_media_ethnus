import React, { useState } from 'react';
import '../cssStyles/styles.css';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Social_media");
  formData.append("cloud_name", "dnrsmjsix");

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dnrsmjsix/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Failed to upload image.");
  }
};

function SignupForm({ shiftContainer }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: null,
    name: '',
    bio: '',
    age: '',
    phoneNumber: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should only contain letters and spaces';
    }

    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (age < 10 || age > 120) {
      newErrors.age = 'Age must be between 10 and 120';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let profilePicUrl = "https://via.placeholder.com/100";

      if (formData.profileImage) {
        profilePicUrl = await uploadToCloudinary(formData.profileImage);
      }

      const res = await fetch("https://social-media-ethnus.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.name,
          userid: formData.name.toLowerCase().replace(/\s+/g, ''),
          password: "123456",
          age: parseInt(formData.age),
          phone: formData.phoneNumber,
          bio: formData.bio,
          profilePic: profilePicUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account created successfully");
        shiftContainer();
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authFormBox">
      <div className="formCard">
        <h2>Join Us Today</h2>
        <div className="authTypeContainer">Create Your Account</div>

        <form onSubmit={handleSubmit} className="signupFormLayout">
          <div className="signupGrid">
            <div className="profileImageContainer">
              <div className="imagePreviewContainer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="imagePreview" />
                ) : (
                  <div className="imagePlaceholder">
                    <i className="fas fa-camera"></i>
                    <span>Add Photo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="imageInput"
              />
              <label htmlFor="profileImage" className="imageLabel">
                Choose Profile Picture
              </label>
            </div>

            <div className="inputGroup nameGroup">
              <i className="fas fa-user" style={{ marginTop: -12 }}></i>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
              {errors.name && <span className="errorMessage">{errors.name}</span>}
            </div>

            <div className="inputGroup phoneGroup">
              <i className="fas fa-phone" style={{ marginTop: -12 }}></i>
              <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
              {errors.phoneNumber && <span className="errorMessage">{errors.phoneNumber}</span>}
            </div>

            <div className="inputGroup bioGroup">
              <i className="fas fa-edit"></i>
              <textarea name="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleInputChange} rows="3" required />
              {errors.bio && <span className="errorMessage">{errors.bio}</span>}
            </div>

            <div className="inputGroup ageGroup">
              <i className="fas fa-birthday-cake" style={{ marginTop: -21 }}></i>
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} min="10" max="120" required />
              {errors.age && <span className="errorMessage">{errors.age}</span>}
            </div>
          </div>

          <button className="authBtn" type="submit" disabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>

          {isLoading && (
            <div className="loadingSpinner">
              <i className="fas fa-spinner"></i> Setting up your new account...
            </div>
          )}
        </form>

        <div className="switchLink">
          Already have an account? <a href="#" onClick={shiftContainer}>Login</a>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
