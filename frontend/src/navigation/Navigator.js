import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaTh, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import '../cssStyles/navigation.css';
import { FaTrash } from 'react-icons/fa';


function Navigator() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: FaHome, label: 'Home', path: '/home' },
    { id: 'profile', icon: FaUser, label: 'Profile', path: '/profile' },
    { id: 'post', icon: FaTh, label: 'post', path: '/post' },
    { id: 'search', icon: FaSearch, label: 'Search', path: '/search' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

const handleLogout = () => {
  localStorage.removeItem("user");  // Clear login session
  navigate('/');
};

const handleDeleteProfile = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const confirm = window.confirm("Are you sure you want to delete your account?");
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Account deleted");
      localStorage.removeItem("user");
      navigate("/");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete account");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Server error");
  }
};

  return (
    <div className="navigationContainer">
      <div className="navItems">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <div
              key={item.id}
              className={`navItem ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="navIconContainer">
                <Icon className="navIcon" />
              </div>
              <span className="navLabel">{item.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="navLogout">
        <div className="navItem logoutItem" onClick={handleLogout}>
          <div className="navIconContainer">
            <FaSignOutAlt className="navIcon" />
          </div>
          <span className="navLabel">Logout</span>
        </div>
        <div className="navItem deleteItem" onClick={handleDeleteProfile}>
  <div className="navIconContainer">
    <FaTrash className="navIcon" />
  </div>
  <span className="navLabel">Delete Profile</span>
</div>

      </div>
    </div>
  );
}

export default Navigator;