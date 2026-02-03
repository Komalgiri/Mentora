import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/Background.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, delayChildren: 0.5, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: -1,
      filter: 'brightness(0.6)',
    },
    overlay: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      padding: '3rem 4rem',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '600px',
      width: '90%',
    },
    title: {
      fontSize: '4rem',
      margin: '0 0 10px 0',
      fontWeight: '700',
      background: 'linear-gradient(45deg, #00AEEF, #a8df65)', // Matching brand colors maybe?
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-2px',
    },
    subtitle: {
      fontSize: '1.2rem',
      marginBottom: '40px',
      lineHeight: '1.6',
      color: '#e0e0e0',
      maxWidth: '400px',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      width: '100%',
    },
    button: {
      padding: '15px 0',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    startChatBtn: {
      background: 'linear-gradient(90deg, #00AEEF 0%, #0077b6 100%)',
    },
    loginBtn: {
      background: 'transparent',
      border: '2px solid rgba(255,255,255,0.3)',
    },
  };

  return (
    <div style={styles.container}>
      {/* Background Image Layer */}
      <div style={styles.background} />

      {/* Main Content Card */}
      <motion.div
        style={styles.overlay}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 style={styles.title} variants={itemVariants}>
          Mentora.Ai
        </motion.h1>

        <motion.p style={styles.subtitle} variants={itemVariants}>
          Your personal sanctuary for mental well-being. <br />
          Experience AI-driven support, mood tracking, and self-care tools.
        </motion.p>

        <motion.div style={styles.buttonContainer} variants={itemVariants}>
          <motion.button
            style={{ ...styles.button, ...styles.startChatBtn }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 174, 239, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartChat}
          >
            Start Journey as Guest
          </motion.button>

          <motion.button
            style={{ ...styles.button, ...styles.loginBtn }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#fff' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
          >
            Login to Save Progress
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
