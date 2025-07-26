import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { 
  FaChartPie, FaArrowLeft, FaArrowRight, FaUsers, FaDollarSign, FaCog, FaSignOutAlt
} from "react-icons/fa";

const Sidebar = ({ setActivePage, activePage }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    
    navigate('/');
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* 🔹 Toggle Button */}
      <div className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </div>

      {/* 🔹 Sidebar Content */}
      <div className="sidebar-content">
        <div className="sidebar-logo-container">
          <img src="/logo_white.png" alt="Logo" className="sidebar-logo-img" />
        </div>

        {/* 🔹 Main Menu Items */}
        <nav className="sidebar-menu">
          <MenuItem 
            isOpen={isOpen} 
            Icon={FaDollarSign} 
            text="Expenses" 
            isActive={activePage === "expenses"} 
            onClick={() => setActivePage("expenses")}
          />
          <MenuItem 
            isOpen={isOpen} 
            Icon={FaChartPie} 
            text="Dashboard" 
            isActive={activePage === "dashboard"} 
            onClick={() => setActivePage("dashboard")}
          />
        </nav>

        {/* 🔹 Divider */}
        <div className="sidebar-menu-divider"></div>

        {/* 🔹 Bottom Menu Items */}
        <nav className="sidebar-menu sidebar-bottom-menu">
          <MenuItem 
            isOpen={isOpen} 
            Icon={FaSignOutAlt} 
            text="Logout" 
            isActive={activePage === "logout"} 
            onClick={handleLogout}
          />
        </nav>
      </div>
    </div>
  );
};

// Sidebar Menu Item Component
const MenuItem = ({ isOpen, Icon, text, isActive, onClick }) => (
  <div 
    className={`sidebar-menu-item ${isActive ? "active" : ""}`} 
    onClick={onClick}
  >
    <Icon className="sidebar-icon" />
    {isOpen && <span>{text}</span>}
    {!isOpen && <div className="sidebar-tooltip">{text}</div>}
  </div>
);

export default Sidebar;
