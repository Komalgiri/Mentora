import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBrain, FaLock, FaChartLine,
  FaArrowRight, FaUserSecret, FaFingerprint, FaSpa, FaMoon
} from 'react-icons/fa';
import backgroundImage from '../assets/Background.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartGuest = () => navigate('/chat');
  const handleLogin = () => navigate('/login');

  const s = {
    container: {
      background: '#050505',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden'
    },
    hero: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8%',
      position: 'relative',
      overflow: 'hidden',
    },
    heroBg: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(0.2) grayscale(30%)',
      zIndex: 0
    },
    heroLeft: {
      flex: '1.2',
      zIndex: 2,
      paddingRight: '50px'
    },
    heroRight: {
      flex: '0.8',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      position: 'relative'
    },
    title: {
      fontSize: 'clamp(4rem, 6vw, 5.5rem)',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '24px',
      background: 'linear-gradient(to right, #fff, #8A2BE2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-2px'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#888',
      lineHeight: '1.6',
      marginBottom: '40px',
      maxWidth: '550px'
    },
    btnPrimary: {
      padding: '20px 40px',
      background: 'linear-gradient(135deg, #8A2BE2, #6A5ACD)',
      color: '#fff',
      borderRadius: '20px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 20px 40px rgba(138, 43, 226, 0.4)'
    },
    btnSecondary: {
      padding: '20px 40px',
      background: 'rgba(255, 255, 255, 0.03)',
      color: '#fff',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    mockup: {
      width: '100%',
      maxWidth: '450px',
      aspectRatio: '9/11',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '40px',
      border: '1px solid rgba(138, 43, 226, 0.2)',
      padding: '20px',
      boxShadow: '0 50px 100px -20px rgba(138, 43, 226, 0.3)',
      position: 'relative',
      backdropFilter: 'blur(30px)'
    },
    section: {
      padding: '120px 8%',
      maxWidth: '1400px',
      margin: '0 auto'
    }
  };

  return (
    <div style={s.container}>
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section style={s.hero}>
        <div style={s.heroBg} />

        {/* Abstract Glow Shapes */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(218, 112, 214, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1 }} />

        {/* Left Side: Content */}
        <div style={s.heroLeft}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ color: '#8A2BE2', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '0.85rem' }}>
              Next Generation Support
            </div>
            <h1 style={s.title}>Redefining your <br /> inner peace.</h1>
            <p style={s.subtitle}>
              Step into a private sanctuary where AI empathy meets clinical precision.
              Designed for your mental clarity, accessible instantly as a guest.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGuest}
                style={s.btnPrimary}
              >
                Enter Sanctuary <FaArrowRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                style={s.btnSecondary}
              >
                Member Login <FaFingerprint />
              </motion.button>
            </div>

            <div style={{ marginTop: '30px', color: '#555', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUserSecret color="#8A2BE2" />
              No account needed. Just click "Enter Sanctuary" to begin.
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Mockup */}
        <div style={s.heroRight}>
          <motion.div
            initial={{ opacity: 0, y: 100, rotateY: 20 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={s.mockup}
          >
            {/* Visual elements inside mockup to simulate app UI */}
            <div style={{ height: '40px', width: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '30px' }} />

            <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
              <div style={{ flex: 1, height: '120px', background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.05))', borderRadius: '25px', border: '1px solid rgba(138,43,226,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <FaBrain fontSize="1.5rem" color="#8A2BE2" />
                <div style={{ fontSize: '0.7rem', fontWeight: '800' }}>EMPATHY AI</div>
              </div>
              <div style={{ flex: 1, height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <FaChartLine fontSize="1.5rem" color="#DA70D6" />
                <div style={{ fontSize: '0.7rem', fontWeight: '800' }}>ANALYTICS</div>
              </div>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '15px' }} />
              <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>How are you feeling today? Take a moment for yourself.</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'rgba(138, 43, 226, 0.2)' }} />
                <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'rgba(138, 43, 226, 0.2)' }} />
                <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'rgba(138, 43, 226, 0.2)' }} />
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '-30px', right: '-40px', padding: '15px 25px', background: '#1a1a1a', borderRadius: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            >
              <FaMoon color="#8A2BE2" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Deep Sleep Tracked</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '40px', left: '-50px', padding: '15px 25px', background: '#1a1a1a', borderRadius: '20px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            >
              <FaSpa color="#DA70D6" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>Zen Session Active</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. SIMPLIFIED STATS/FEATURES */}
      <section style={s.section}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <FaLock color="#8A2BE2" /> Absolute Privacy
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>We provide a complete "Guest Mode" where no data is stored on our servers. Your mind is your territory, and we keep it that way.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <FaBrain color="#DA70D6" /> Active Empathy
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Our AI models are specifically designed to listen, recognize emotional patterns, and provide evidence-based mental support.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <FaChartLine color="#8A2BE2" /> Neural Patterns
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>Advanced data correlation between your sleep cycles and mood logs helps you understand the "why" behind your emotions.</p>
          </div>
        </div>
      </section>

      {/* 3. CTA FOOTER */}
      <footer style={{ ...s.section, textAlign: 'center', padding: '100px 0', borderTop: '1px solid #111' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '40px' }}>Begin your journey.</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStartGuest}
          style={{ ...s.btnPrimary, margin: '0 auto' }}
        >
          Enter Sanctuary Now
        </motion.button>
        <div style={{ marginTop: '80px', color: '#222', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '800' }}>
          © 2026 MENTORA AI | BUILT FOR PEACE
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
