import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';
import backgroundImage from '../assets/loginBackground.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup, googleLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, username);
      }
      navigate('/chat');
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
      navigate('/chat');
    } catch (e) {
      setError("Failed to login with Google.");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      height: '100vh',
      width: '100%',
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // Align to right
      fontFamily: "'Inter', sans-serif",
      paddingRight: '5%' // Add some spacing from the edge
    },
    rightSection: {
      width: '40%',
      minWidth: '450px',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 10
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      padding: '40px',
      background: 'rgba(20, 20, 20, 0.7)',
      backdropFilter: 'blur(25px)',
      borderRadius: '32px',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      color: '#fff'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px'
    },
    icon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '15px 15px 15px 45px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      color: '#fff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    btnMain: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #00AEEF 0%, #0077b6 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 10px 20px -5px rgba(0, 174, 239, 0.4)'
    },
    btnGoogle: {
      width: '100%',
      padding: '14px',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
      transition: 'background 0.3s'
    }
  };

  return (
    <div style={s.page}>
      <div style={s.rightSection}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={s.card}
        >
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0', fontWeight: '800', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>
              {isLogin ? 'Continue your wellness journey.' : 'Start your path to mental clarity.'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', padding: '12px', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '20px', border: '1px solid rgba(255,77,77,0.2)', textAlign: 'center' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={s.inputGroup}>
                  <FaUser style={s.icon} />
                  <input type="text" placeholder="Full Name" style={s.input} value={username} onChange={(e) => setUsername(e.target.value)} required />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={s.inputGroup}>
              <FaEnvelope style={s.icon} />
              <input type="email" placeholder="Email Address" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={s.inputGroup}>
              <FaLock style={s.icon} />
              <input type="password" placeholder="Password" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {!isLogin && (
              <div style={s.inputGroup}>
                <FaLock style={s.icon} />
                <input type="password" placeholder="Confirm Password" style={s.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={s.btnMain}
              type="submit"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Join Mentora')}
              {!loading && <FaArrowRight fontSize="0.8rem" />}
            </motion.button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0', gap: '15px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <motion.button
            whileHover={{ background: 'rgba(255,255,255,0.1)' }}
            disabled={loading}
            onClick={handleGoogleLogin}
            style={s.btnGoogle}
          >
            <FaGoogle style={{ color: '#4285F4' }} />
            Connect with Google
          </motion.button>

          <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: '#888' }}>
            {isLogin ? "New to Mentora? " : 'Already a member? '}
            <span
              onClick={toggleForm}
              style={{ color: '#00AEEF', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
