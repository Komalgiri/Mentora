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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg,#e8d5f5 0%,#d0c4f0 30%,#c2d5f5 65%,#f0d5f7 100%)',
      color: '#1a1a2e',
    }}>
      {/* App Header */}
      <header style={{
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
      }}>
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer', fontWeight: 900, fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 22 }}>🧠</span>
          <span style={{
            background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Mentora</span>
        </div>

        <div style={{ position: 'relative' }}>
          <motion.div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontWeight: 800, fontSize: 15,
              boxShadow: '0 4px 12px rgba(139,92,246,.3)',
            }}
          >
            {currentUser ? (currentUser.displayName?.[0]?.toUpperCase() || 'U') : '👤'}
          </motion.div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  borderRadius: 18, padding: 10, minWidth: 180,
                  boxShadow: '0 16px 40px rgba(139,92,246,.15)',
                }}
              >
                {currentUser ? (
                  <>
                    <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#9999cc', fontWeight: 600 }}>{currentUser.email}</div>
                    <div className="menu-item" onClick={() => { navigate('/chat/profile'); setShowProfileMenu(false); }}>👤 Profile</div>
                    <div className="menu-item" style={{ color: '#ef4444' }} onClick={handleLogout}>← Logout</div>
                  </>
                ) : (
                  <div className="menu-item" onClick={() => navigate('/login')}>Login / Sign Up</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ paddingBottom: '100px' }}>
        <Routes>
          <Route path="chatbot"      element={<ChatInterface />} />
          <Route path="mood-tracker" element={<MoodTracker />} />
          <Route path="self-care"    element={<SelfCareResources />} />
          <Route path="story"        element={<Storyteller />} />
          <Route path="profile"      element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="question-ans" element={<QuestionAns />} />
          <Route path="sleeptool"    element={<Sleeptool />} />
          <Route path="creative"     element={<Creative />} />
          <Route path="*"            element={<ChatInterface />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="chatbot"      className="nav-item"><FaCommentAlt /><span>Chat</span></Link>
        <Link to="mood-tracker" className="nav-item"><FaHeartbeat /><span>Studio</span></Link>
        <Link to="self-care"    className="nav-item"><FaLeaf /><span>Care</span></Link>
        <Link to="profile"      className="nav-item"><FaRainbow /><span>Profile</span></Link>
      </nav>
    </div>
  );
};

const styles = `
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 420px;
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 28px;
    padding: 12px 8px;
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(139,92,246,0.15);
  }
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #b0b0cc;
    text-decoration: none;
    transition: all 0.2s ease;
    flex: 1;
    font-weight: 700;
  }
  .nav-item:hover, .nav-item.active {
    color: #8B5CF6;
  }
  .nav-item span {
    font-size: 10px;
    margin-top: 5px;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
  }
  .menu-item {
    padding: 10px 12px;
    cursor: pointer;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a2e;
    transition: background 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .menu-item:hover {
    background: rgba(139,92,246,0.08);
    color: #8B5CF6;
  }
`;


const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
