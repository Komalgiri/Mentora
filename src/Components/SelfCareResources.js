import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSpa, FaLeaf, FaBed, FaPalette, FaMoon, FaGamepad,
  FaEdit, FaRunning, FaBook, FaPhoneSlash, FaTint,
  FaSun, FaWind, FaCheckCircle, FaStar
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { addPoints } from '../utils/gamification';

// Import Assets
import sleepImage from '../assets/sleep.jpg';
import playImage from '../assets/Play.jpg';
import creativeImage from '../assets/creative.jpg';
import meditationImage from '../assets/meditation.jpg';
import exerciseImage from '../assets/exercise.jpg';
import readingImage from '../assets/reading.jpg';

const SelfCareResources = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTool, setActiveTool] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [thoughts, setThoughts] = useState('');
  const [selectedPref, setSelectedPref] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchUserPreference();
    }
  }, [currentUser]);

  const fetchUserPreference = async () => {
    if (!currentUser || !currentUser.uid) return;
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'preferences', 'selfcare');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedPref(docSnap.data().choice);
      }
    } catch (error) {
      console.error("Error fetching preference:", error);
    }
  };

  const handlePreferenceClick = async (choice) => {
    if (!currentUser) {
      setSelectedPref(choice); // Local only for guest
      return;
    }

    setIsSaving(true);
    setSelectedPref(choice);
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'preferences', 'selfcare');
      await setDoc(docRef, { choice, updatedAt: new Date() });
    } catch (error) {
      console.error("Error saving preference:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMeditationComplete = async () => {
    if (currentUser) {
      await addPoints(currentUser.uid, 'MEDITATION');
      alert("Meditation complete! +20 Points added to your wellness level.");
    }
    setActiveTool(null);
  };

  const mainTools = [
    {
      id: 'meditation',
      title: 'Guided Meditation',
      icon: <FaSpa />,
      desc: '5-minute session to center your mind and find inner peace.',
      color: '#a8df65',
      action: 'Start Timer'
    },
    {
      id: 'grounding',
      title: 'Grounding Drill',
      icon: <FaLeaf />,
      desc: 'A 5-4-3-2-1 technique to pull you back into the present moment.',
      color: '#4facfe',
      action: 'Start Quiz',
      path: '/chat/question-ans'
    },
    {
      id: 'sleep',
      title: 'Sleep Hygiene',
      icon: <FaBed />,
      desc: 'Optimize your rest with our specialized tracking tools.',
      color: '#9370db',
      action: 'Track Sleep',
      path: '/chat/sleeptool'
    },
    {
      id: 'creative',
      title: 'Creative Space',
      icon: <FaPalette />,
      desc: 'Unleash your thoughts through free-form artistic expression.',
      color: '#ff69b4',
      action: 'Open Canvas',
      path: '/chat/creative'
    }
  ];

  const freeTimeActivities = [
    { title: 'Sleep', img: sleepImage, quote: 'Rest is the best meditation.', icon: <FaMoon /> },
    { title: 'Play', img: playImage, quote: 'Play is our brain’s favorite way to learn.', icon: <FaGamepad /> },
    { title: 'Create', img: creativeImage, quote: 'Creativity is intelligence having fun.', icon: <FaEdit /> },
    { title: 'Meditate', img: meditationImage, quote: 'Quiet the mind, and the soul will speak.', icon: <FaStar /> },
    { title: 'Exercise', img: exerciseImage, quote: 'Your body is your temple.', icon: <FaRunning /> },
    { title: 'Read', img: readingImage, quote: 'A room without books is like a body without a soul.', icon: <FaBook /> }
  ];

  useEffect(() => {
    let timer;
    if (activeTool === 'meditation' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeTool, timeLeft]);

  const formatTime = (s_time) => {
    const mins = Math.floor(s_time / 60);
    const secs = s_time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const s = {
    container: { padding: '20px', background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '30px', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto', justifyContent: 'center' },
    toolCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' },
    iconBox: (color) => ({ width: '50px', height: '50px', borderRadius: '15px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: color }),
    btn: (color) => ({ background: color, color: '#000', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto' }),

    sectionHeader: { marginTop: '50px', marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#888', letterSpacing: '2px' },
    activityScroll: { display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none', paddingLeft: '20px', paddingRight: '20px' },
    activityCard: { minWidth: '220px', height: '300px', position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' },
    selectedCard: { borderColor: '#00AEEF', boxShadow: '0 0 15px rgba(0, 174, 239, 0.4)' },
    activityOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' },

    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: '#161616', border: '1px solid #333', borderRadius: '28px', padding: '40px', width: '90%', maxWidth: '400px', textAlign: 'center' }
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Self-Care Hub</motion.h1>
        <p style={{ color: '#666' }}>Daily rituals for a balanced mind and body.</p>
      </div>

      <div style={s.grid}>
        {mainTools.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}
            style={s.toolCard}
          >
            <div style={s.iconBox(tool.color)}>{tool.icon}</div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{tool.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', lineHeight: '1.5' }}>{tool.desc}</p>
            <button
              style={s.btn(tool.color)}
              onClick={() => {
                if (tool.path) navigate(tool.path);
                else setActiveTool(tool.id);
              }}
            >
              {tool.action}
            </button>
          </motion.div>
        ))}
      </div>

      <h2 style={s.sectionHeader}>FREE TIME PREFERENCES</h2>
      <div style={s.activityScroll}>
        {freeTimeActivities.map((act, idx) => (
          <motion.div
            key={act.title}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePreferenceClick(act.title)}
            style={{ ...s.activityCard, ...(selectedPref === act.title ? s.selectedCard : {}) }}
          >
            <img src={act.img} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={s.activityOverlay}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', color: '#00AEEF' }}>{act.icon}</div>
                {selectedPref === act.title && <FaCheckCircle style={{ color: '#00AEEF', fontSize: '1.2rem' }} />}
              </div>
              <h4 style={{ margin: '10px 0 5px 0', fontSize: '1.2rem' }}>{act.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic' }}>{act.quote}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 style={s.sectionHeader}>QUICK WELLNESS TIPS</h2>
      <div style={{ ...s.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '100px' }}>
        {[
          { t: 'Digital Detox', d: 'Avoid screens for at least 30 mins before sleep.', i: <FaPhoneSlash /> },
          { t: 'Hydration', d: 'A glass of water can significantly boost energy.', i: <FaTint /> },
          { t: 'Sunlight', d: '10 mins of sun exposure improves your mood.', i: <FaSun /> },
          { t: 'Deep Breaths', d: 'Reset your nervous system with 3 deep inhales.', i: <FaWind /> }
        ].map((tip, idx) => (
          <motion.div
            key={tip.t}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            style={{ ...s.toolCard, padding: '20px', textAlign: 'center', height: 'auto' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#888' }}>{tip.i}</div>
            <h4 style={{ margin: '0 0 5px 0' }}>{tip.t}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{tip.d}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeTool === 'meditation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={s.modalBackdrop}
          // Removed onClick={null} to prevent accidental closure
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={s.modal}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Meditation</h2>
                <button onClick={() => setActiveTool(null)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>
              <p style={{ color: '#aaa', marginBottom: '30px' }}>Focus on your breath. Let thoughts pass like clouds.</p>

              <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #a8df65', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', position: 'relative' }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: 'absolute', inset: 0, background: '#a8df65', borderRadius: '50%', opacity: 0.1 }}
                />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
              </div>

              {!currentUser && (
                <div style={{ padding: '10px', background: 'rgba(0, 174, 239, 0.1)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.8rem', color: '#00AEEF' }}>
                  Guest: Log in to save these 20 XP!
                </div>
              )}

              <textarea
                placeholder="Reflect on your focus..."
                style={{ width: '100%', background: '#222', border: '1px solid #444', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '0.9rem', marginBottom: '20px', height: '80px', resize: 'none' }}
                value={thoughts}
                onChange={e => setThoughts(e.target.value)}
              />

              <button style={{ ...s.btn('#a8df65'), width: '100%' }} onClick={handleMeditationComplete}>
                {currentUser ? "Complete & Earn XP" : "Finish Session"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
    </div>
  );
};

export default SelfCareResources;
