import React, { useState } from 'react';
import Chat from "../Components/chat";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const styles = {
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent',
      color: '#fff',
      padding: '20px',
    },
    branding: {
      marginTop: '20px',
      marginBottom: '30px',
      textAlign: 'center',
    },
    heading: {
      fontSize: '1.2rem',
      fontWeight: '400',
      color: '#666',
      marginBottom: '5px',
    },
    subheading: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(to right, #00AEEF, #a8df65)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px'
    }
  };

  return (
    <div style={styles.chatContainer}>
      <motion.div
        style={styles.branding}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={styles.heading}>Your Mental Health Partner</h2>
        <h1 style={styles.subheading}>Mentora.AI</h1>
      </motion.div>

      <Chat />
    </div>
  );
};

export default ChatInterface;
