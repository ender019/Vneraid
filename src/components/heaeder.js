import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';


import '../static/header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
        console.log("43")
        console.log(userData)
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
        navigate('/auth');
      }
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  const goToAuth = () => {
    navigate('/auth');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">TAntiSpam</a>
        </div>
        {userData ? (
          <div className="account-dropdown">
            <button className="account-button" onClick={toggleDropdown}>
              <span className="account-name"><h3>{ userData.name }</h3></span>
              <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a href="/settings" className="dropdown-item">Settings</a>
                <a href="#" onClick={handleLogout} className="dropdown-item">Logout</a>
              </div>
            )}
          </div>
        ) : (
          <button className="account-button" onClick={goToAuth}>
            <span className="account-name"><h3>Войти</h3></span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;