import React, { useState, useEffect, useRef } from "react";
import "./MobileMenu.css";
import { FaBars, FaTimes, FaChartPie, FaUsers, FaDollarSign, FaCog, FaSignOutAlt } from "react-icons/fa";

const MobileMenu = ({ leftContent, centerContent, rightContent, setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-hamburger-btn")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🔹 Navbar */}
      <div className="mobile-menu-navbar">
        <div className="mobile-menu-navbar-section left">
          {leftContent || (
            <button
            className="mobile-menu-hamburger-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
                           
          )}
        </div>

        {/* Middle Section */}
        <div className="mobile-menu-navbar-section center">{centerContent}</div>

        {/* Right Section */}
        <div className="mobile-menu-navbar-section right">{rightContent}</div>
      </div>

      {/* 🔹 Full-width Mobile Menu */}
      <div ref={menuRef} className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {/* 🔹 Logo Section */}
        <div className="mobile-menu-logo">
          <img src="/logo_white.png" alt="Logo" className="mobile-menu-logo-img" />
        </div>

        {/* 🔹 Menu Items */}
        <nav className="mobile-menu-items">
          {/* Top Menu */}
          <div className="mobile-menu-top">
            <MobileMenuItem 
              Icon={FaDollarSign} 
              text="Expenses" 
              onClick={() => handleNavigation("expenses")}
            />
            <MobileMenuItem 
              Icon={FaChartPie} 
              text="Dashboard" 
              onClick={() => handleNavigation("dashboard")}
            />
          </div>

          {/* Bottom Menu */}
          <div className="mobile-menu-bottom">
            <div className="mobile-menu-divider"></div>
            <MobileMenuItem 
              Icon={FaSignOutAlt} 
              text="Logout" 
              onClick={handleLogout}
            />
          </div>
        </nav>
      </div>
    </>
  );
};

// 🔹 Mobile Menu Item Component
const MobileMenuItem = ({ Icon, text, onClick }) => (
  <div className="mobile-menu-item" onClick={onClick}>
    <Icon className="mobile-menu-icon" />
    <span>{text}</span>
  </div>
);

export default MobileMenu;
