import React, { useState } from 'react';
import { FiUser, FiChevronDown } from 'react-icons/fi';


import '../static/header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">TAntiSpam</a>
        </div>

        <div className="account-dropdown">
          <button className="account-button" onClick={toggleDropdown}>
          
            <span className="account-name"><h3>Mike</h3></span>
            <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="/settings" className="dropdown-item">Settings</a>
              <div className="dropdown-divider"></div>
              <a href="/logout" className="dropdown-item">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;