import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MobileMenu from "../components/MobileMenu";
import Expenses from "../components/Expenses";
import Dashboard from "../components/Dashboard";
import PeriodSelector from '../components/PeriodSelector';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activePage, setActivePage] = useState("expenses"); // Manage selected page
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Define Navbar Content Based on Active Page
  const getMobileNavbarProps = () => {
    if (activePage === "expenses") {
      return {
        centerContent: <h1 className="expenses-title"></h1>,
        rightContent: (
          <button 
            className="new-expense-button"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: 300,
              padding: '0.4rem 1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',  // Prevent button text from wrapping
              marginRight: '10px',
            }}
          >
            + New Expense
          </button>
        ),
      };
    } else if (activePage === "dashboard") {
      return {
        centerContent: (
          <h1 className="expenses-title" style={{ 
            fontSize: '24px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            margin: 0
          }}>
          </h1>
        ),
        rightContent: (
          <div style={{ 
            marginLeft: '10px',
            transform: 'scale(0.7)',  // Smaller than before (0.8 -> 0.7)
            transformOrigin: 'right center',
            display: 'flex',
            alignItems: 'center'
          }}>
            <PeriodSelector onSelect={(period) => {
              setSelectedPeriod(period);
            }} />
          </div>
        ),
      };
    } else {
      return {};
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {isMobile ? (
        <>
          <MobileMenu 
            {...getMobileNavbarProps()} 
            setActivePage={setActivePage}
          />
          {/* Main Content with top margin for mobile */}
          <div style={{ 
            flex: 1, 
            marginLeft: "-40px", 
            overflowY: "auto",
            marginTop: "60px"  // Add space below the mobile menu
          }}>
            {activePage === "expenses" ? (
              <Expenses 
                isMobile={isMobile} 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
              />
            ) : activePage === "dashboard" ? (
              <Dashboard 
                isMobile={isMobile} 
                selectedPeriod={selectedPeriod} // Pass selectedPeriod directly
                hidePeriodSelector={isMobile}
              />
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Sidebar setActivePage={setActivePage} activePage={activePage} />
          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            {activePage === "expenses" ? (
              <Expenses 
                isMobile={isMobile} 
                isModalOpen={isModalOpen} 
                setIsModalOpen={setIsModalOpen} 
              />
            ) : activePage === "dashboard" ? (
              <Dashboard 
                isMobile={isMobile} 
                selectedPeriod={selectedPeriod} // Pass selectedPeriod directly
                hidePeriodSelector={isMobile}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
