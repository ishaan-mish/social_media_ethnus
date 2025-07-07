import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaTh, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import '../cssStyles/navigation.css';

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
      </div>
    </div>
  );
}

export default Navigator;