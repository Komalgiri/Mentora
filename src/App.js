import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import ChatInterface from './Components/ChatInterface';
import MoodTracker from './Components/MoodTracker';
import SelfCareResources from './Components/SelfCareResources';
import Storyteller from './Components/Storyteller';
import QuestionAns from './Components/QuestionAns';
import Sleeptool from './Components/Sleeptool';
import Creative from './Components/Creative';
import Profile from './Components/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RequireAuth from './Components/RequireAuth';


// Import icons from react-icons/fa for web
import { FaCommentAlt, FaHeartbeat, FaLeaf, FaRainbow } from 'react-icons/fa';

import { motion, AnimatePresence } from 'framer-motion';
import { requestNotificationPermission, scheduleReminder } from './utils/notifications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/chat/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  React.useEffect(() => {
    requestNotificationPermission();
    const interval = scheduleReminder(4);
    return () => clearInterval(interval); // Cleanup to prevent duplicate intervals
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Global App Header */}
      <header style={{
        padding: '15px 25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', background: 'linear-gradient(45deg, #8A2BE2, #DA70D6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Mentora
        </div>

        <div style={{ position: 'relative' }}>
          <motion.div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            whileTap={{ scale: 0.9 }}
            style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(138,43,226,0.2)' }}
          >
            {currentUser ? (currentUser.displayName?.[0].toUpperCase() || 'U') : '👤'}
          </motion.div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', right: 0, top: '45px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '10px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              >
                {currentUser ? (
                  <>
                    <div style={{ padding: '10px', fontSize: '0.8rem', color: '#888' }}>{currentUser.email}</div>
                    <div className="menu-item" onClick={() => { navigate('/chat/profile'); setShowProfileMenu(false); }}>Profile</div>
                    <div className="menu-item" style={{ color: '#ff4d4d' }} onClick={handleLogout}>Logout</div>
                  </>
                ) : (
                  <div className="menu-item" onClick={() => navigate('/login')}>Login / Sign Up</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ paddingBottom: '90px' }}>
        <Routes>
          <Route path="chatbot" element={<ChatInterface />} />
          <Route path="mood-tracker" element={<MoodTracker />} />
          <Route path="self-care" element={<SelfCareResources />} />
          <Route path="story" element={<Storyteller />} />

          {/* Protected tool routes */}
          <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Guest accessible tools */}
          <Route path="question-ans" element={<QuestionAns />} />
          <Route path="sleeptool" element={<Sleeptool />} />
          <Route path="creative" element={<Creative />} />

          <Route path="*" element={<ChatInterface />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="chatbot" className="nav-item">
          <FaCommentAlt />
          <span>Chat</span>
        </Link>
        <Link to="mood-tracker" className="nav-item">
          <FaHeartbeat />
          <span>Studio</span>
        </Link>
        <Link to="self-care" className="nav-item">
          <FaLeaf />
          <span>Care</span>
        </Link>
        <Link to="profile" className="nav-item">
          <FaRainbow />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

const styles = `
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 450px;
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 10px;
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    transition: all 0.2s ease;
    flex: 1;
  }
  .nav-item:hover, .nav-item.active {
    color: #8A2BE2;
  }
  .nav-item span {
    font-size: 10px;
    margin-top: 5px;
  }
  .menu-item {
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: background 0.2s;
  }
  .menu-item:hover {
    background: rgba(255,255,255,0.05);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
