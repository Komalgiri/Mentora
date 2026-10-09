import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, limit, getDocs,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { addPoints } from '../utils/gamification';

/* ── helpers ──────────────────────────────────────────────────── */
const MOODS = [
  { label: 'Happy',   emoji: '😊', score: 20, bg: '#d4edda', accent: '#22c55e', tip: "You're glowing! Share that joy 🌈" },
  { label: 'Angry',   emoji: '😡', score: 8,  bg: '#fde8cc', accent: '#f97316', tip: 'Try 4-7-8 breathing to cool down 🌬️' },
  { label: 'Tired',   emoji: '😴', score: 10, bg: '#fce4ec', accent: '#ec4899', tip: 'A 20-min nap works wonders 💤'   },
  { label: 'Sad',     emoji: '🥺', score: 7,  bg: '#d1ecf1', accent: '#0ea5e9', tip: 'It's okay to feel this way 💙'   },
];

const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ── mood card ────────────────────────────────────────────────── */
const MoodCard = ({ mood, onSelect, selected }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onSelect(mood)}
    style={{
      background: selected ? mood.accent : mood.bg,
      borderRadius: 24, padding: '20px 16px',
      cursor: 'pointer', position: 'relative',
      border: selected ? `2px solid ${mood.accent}` : '2px solid transparent',
      boxShadow: selected ? `0 8px 24px ${mood.accent}44` : '0 4px 16px rgba(0,0,0,.07)',
      transition: 'all .25s',
    }}
  >
    <div style={{
      fontWeight: 800, fontSize: 16,
      color: selected ? '#fff' : '#1a1a2e',
      marginBottom: 10,
    }}>{mood.label}</div>
    <div style={{ fontSize: 40 }}>{mood.emoji}</div>
    <div style={{
      position: 'absolute', bottom: 12, right: 12,
      fontSize: 11, color: selected ? 'rgba(255,255,255,.7)' : mood.accent,
      fontWeight: 700,
    }}>↗</div>
  </motion.div>
);

/* ── stat widget ──────────────────────────────────────────────── */
const Widget = ({ label, children, accent, style }) => (
  <div style={{
    borderRadius: 20, padding: 16, overflow: 'hidden',
    background: accent, ...style,
  }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.75)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
    {children}
  </div>
);

/* ── modal ────────────────────────────────────────────────────── */
const Modal = ({ children, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,20,60,0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 28,
          padding: 28, width: '100%', maxWidth: 380,
          boxShadow: '0 24px 60px rgba(139,92,246,.2)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─────────────────────────────────────────────────────────────────
   MoodTracker
───────────────────────────────────────────────────────────────── */
const MoodTracker = () => {
  const { currentUser } = useAuth();
  const [view, setView]           = useState('status');   // 'status' | 'insights'
  const [selectedMood, setSelected] = useState(null);
  const [moodData, setMoodData]   = useState([]);
  const [streak, setStreak]       = useState(0);
  const [avgScore, setAvgScore]   = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [breathOpen, setBreathOpen]   = useState(false);
  const [toast, setToast]         = useState('');

  /* fetch -------------------------------------------------------- */
  const fetchData = React.useCallback(async () => {
    if (!currentUser?.uid) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'users', currentUser.uid, 'mood_logs'),
        orderBy('createdAt', 'desc'), limit(30),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
          date: d.createdAt?.toDate().toLocaleDateString(undefined, { month:'short', day:'numeric' }) || 'N/A',
          score: d.score,
          mood: d.mood,
          timestamp: d.createdAt?.toMillis() || 0,
        };
      });
      setMoodData([...data].reverse());
      if (data.length > 0) {
        setAvgScore((data.reduce((a,b) => a + b.score, 0) / data.length).toFixed(1));
        calcStreak(data);
      }
    } catch(e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [currentUser]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const calcStreak = (data) => {
    const sorted = [...data].sort((a,b) => b.timestamp - a.timestamp);
    let s = 1;
    const today = new Date().setHours(0,0,0,0);
    let last = new Date(sorted[0].timestamp).setHours(0,0,0,0);
    if (today - last > 86400000) { setStreak(0); return; }
    for (let i=1; i<sorted.length; i++) {
      let curr = new Date(sorted[i].timestamp).setHours(0,0,0,0);
      if (last - curr === 86400000) { s++; last = curr; }
      else if (last - curr === 0) continue;
      else break;
    }
    setStreak(s);
  };

  /* actions ------------------------------------------------------ */
  const logMood = async (mood) => {
    setSelected(mood);
    if (!currentUser) { showToast('Sign in to save your mood 🔐'); return; }
    await addDoc(collection(db, 'users', currentUser.uid, 'mood_logs'), {
      score: mood.score, mood: mood.label, createdAt: serverTimestamp(),
    });
    await addPoints(currentUser.uid, 'MOOD_LOG');
    showToast(`${mood.emoji} ${mood.label} logged! +10 pts`);
    fetchData();
  };

  const saveJournal = async () => {
    if (!journalText.trim() || !currentUser) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'journal'), {
      text: journalText, createdAt: serverTimestamp(),
    });
    await addPoints(currentUser.uid, 'JOURNAL');
    setJournalText(''); setJournalOpen(false);
    showToast('Journal saved! +15 pts 📓');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  /* shared styles */
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(145deg,#e8d5f5 0%,#d0c4f0 30%,#c2d5f5 65%,#f0d5f7 100%)',
    fontFamily: "'Nunito', sans-serif",
    padding: '0 0 100px',
  };

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 10px',
  };

  /* ── render: status ─────────────────────────────────────────── */
  const renderStatus = () => (
    <div style={{ padding: '10px 24px 0' }}>
      <h2 style={{
        fontSize: 28, fontWeight: 900, lineHeight: 1.25,
        color: '#4a4a6a', marginBottom: 24,
      }}>
        How are you{' '}
        <span style={{ fontStyle: 'italic', fontWeight: 900, color: '#1a1a2e' }}>describe your</span>
        <br />
        <span style={{ color: '#1a1a2e' }}>Feeling today?</span>
      </h2>

      {/* mood grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:24 }}>
        {MOODS.map(m => (
          <MoodCard key={m.label} mood={m} selected={selectedMood?.label === m.label} onSelect={logMood} />
        ))}
      </div>

      {/* tip */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{
              background: 'rgba(255,255,255,0.8)', backdropFilter:'blur(12px)',
              borderRadius: 18, padding: '14px 18px', marginBottom: 16,
              border: `1.5px solid ${selectedMood.accent}44`,
              color: '#4a4a6a', fontSize: 14, fontWeight: 600,
            }}
          >
            💡 {selectedMood.tip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* action buttons */}
      <motion.button
        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
        onClick={() => setView('insights')}
        style={{
          width:'100%', padding:'16px 0', borderRadius:50,
          background:'linear-gradient(135deg,#8B5CF6,#7C3AED)',
          color:'#fff', border:'none', fontFamily:'inherit',
          fontSize:16, fontWeight:800, cursor:'pointer',
          boxShadow:'0 8px 24px rgba(139,92,246,.35)',
          marginBottom:12,
        }}
      >
        Talk with AI 💬
      </motion.button>

      <button
        onClick={() => setJournalOpen(true)}
        style={{
          width:'100%', padding:'14px 0', borderRadius:50,
          background:'rgba(255,255,255,0.7)', backdropFilter:'blur(10px)',
          color:'#7C3AED', border:'1.5px solid rgba(139,92,246,.3)',
          fontFamily:'inherit', fontSize:15, fontWeight:700, cursor:'pointer',
        }}
      >
        Write your thoughts ✍️
      </button>
    </div>
  );

  /* ── render: insights ───────────────────────────────────────── */
  const renderInsights = () => {
    const last7 = WEEK_DAYS.map((d,i) => {
      const entry = moodData[moodData.length - 7 + i];
      return { day: d, score: entry?.score || 0, mood: entry?.mood };
    });

    const stressLevel = avgScore > 0 ? Math.max(0, 25 - parseFloat(avgScore)) : 12;

    return (
      <div style={{ padding:'10px 24px 0' }}>
        <h2 style={{ fontSize:28, fontWeight:900, color:'#4a4a6a', lineHeight:1.2, marginBottom:24 }}>
          Your Mental <span style={{ color:'#1a1a2e', display:'block' }}>Insights</span>
        </h2>

        {/* mood trend */}
        <div style={{
          background:'rgba(255,255,255,0.75)', backdropFilter:'blur(16px)',
          borderRadius:24, padding:20, marginBottom:16,
          border:'1px solid rgba(255,255,255,.9)',
          boxShadow:'0 4px 20px rgba(0,0,0,.06)',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <span style={{ fontWeight:800, color:'#1a1a2e', fontSize:15 }}>Mood Trend</span>
            <span style={{ fontSize:12, color:'#8B5CF6', fontWeight:700, background:'rgba(139,92,246,.1)', padding:'4px 10px', borderRadius:20 }}>7 days</span>
          </div>

          {isLoading ? (
            <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa' }}>Loading…</div>
          ) : moodData.length === 0 ? (
            <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb', fontSize:13 }}>Log your mood to see trends</div>
          ) : (
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={last7}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize:10, fill:'#aaa', fontFamily:'Nunito' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0,25]} />
                <Tooltip
                  contentStyle={{ background:'rgba(255,255,255,.95)', border:'none', borderRadius:12, fontSize:12 }}
                  formatter={(v,n,p) => [p.payload.mood || v, 'Mood']}
                />
                <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#moodGrad)" dot={{ fill:'#8B5CF6', r:3 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* widget row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          {/* stress */}
          <Widget label="Stress Level" accent="linear-gradient(135deg,#f97316,#fb923c)" style={{}}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(255,255,255,.7)', marginBottom:6 }}>
              <span>Low</span><span>High</span>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:36 }}>
              {[30,50,40,70,55,65,stressLevel * 4].map((h,i) => (
                <div key={i} style={{
                  flex:1, borderRadius:4,
                  height:`${Math.min(h,100)}%`,
                  background:'rgba(255,255,255,0.7)',
                }} />
              ))}
            </div>
          </Widget>

          {/* impact calendar */}
          <Widget label="Impact" accent="linear-gradient(135deg,#8B5CF6,#6D28D9)" style={{}}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', textAlign:'right', marginBottom:6 }}>High</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {Array.from({length:28}).map((_,i) => (
                <div key={i} style={{
                  aspectRatio:'1', borderRadius:3,
                  background: i < streak ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
                }} />
              ))}
            </div>
          </Widget>
        </div>

        {/* sleep quality */}
        <div style={{
          background:'rgba(255,255,255,0.75)', backdropFilter:'blur(16px)',
          borderRadius:20, padding:'14px 18px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          border:'1px solid rgba(255,255,255,.9)',
          boxShadow:'0 4px 16px rgba(0,0,0,.06)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>💤</div>
            <div>
              <div style={{ fontWeight:800, color:'#1a1a2e', fontSize:14 }}>Sleep Quality</div>
              <div style={{ fontWeight:700, color:'#8B5CF6', fontSize:18 }}>6.8 <span style={{ fontSize:12, fontWeight:600, color:'#aaa' }}>hr/day</span></div>
            </div>
          </div>
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
            <path d="M0 25 Q10 5 20 15 Q30 25 40 10 Q50 0 60 8" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* quick stats */}
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          {[
            { label:'Streak', value:`🔥 ${streak}d` },
            { label:'Avg Mood', value:`📊 ${avgScore}` },
            { label:'Logs', value:`📝 ${moodData.length}` },
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:'rgba(255,255,255,0.7)', backdropFilter:'blur(10px)',
              borderRadius:16, padding:'12px 10px', textAlign:'center',
              border:'1px solid rgba(255,255,255,.9)',
            }}>
              <div style={{ fontWeight:800, fontSize:16, color:'#1a1a2e' }}>{s.value}</div>
              <div style={{ fontSize:10, color:'#aaa', fontWeight:700, marginTop:3, textTransform:'uppercase', letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* breathe */}
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={() => setBreathOpen(true)}
          style={{
            width:'100%', marginTop:20, padding:'14px 0', borderRadius:50,
            background:'linear-gradient(135deg,#8B5CF6,#7C3AED)',
            color:'#fff', border:'none', fontFamily:'inherit',
            fontSize:15, fontWeight:800, cursor:'pointer',
            boxShadow:'0 8px 24px rgba(139,92,246,.35)',
          }}
        >
          Start Breathing Exercise 🧘
        </motion.button>
      </div>
    );
  };

  /* ── main render ────────────────────────────────────────────── */
  return (
    <div style={pageStyle}>
      {/* header */}
      <div style={headerStyle}>
        {view === 'insights' ? (
          <button onClick={() => setView('status')} style={{ background:'rgba(255,255,255,0.6)', border:'none', borderRadius:50, width:36, height:36, cursor:'pointer', fontSize:16 }}>‹</button>
        ) : <div />}
        <span style={{ fontWeight:800, fontSize:16, color:'#1a1a2e' }}>
          {view === 'status' ? 'Mood Status' : 'Mood Insights'}
        </span>
        <button
          onClick={() => setView(v => v === 'status' ? 'insights' : 'status')}
          style={{ background:'rgba(255,255,255,0.6)', border:'none', borderRadius:50, width:36, height:36, cursor:'pointer', fontSize:16 }}
        >
          {view === 'status' ? '📊' : '😊'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity:0, x: view === 'insights' ? 40 : -40 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x: view === 'insights' ? -40 : 40 }}
          transition={{ duration:.3 }}
        >
          {view === 'status' ? renderStatus() : renderInsights()}
        </motion.div>
      </AnimatePresence>

      {/* Journal modal */}
      {journalOpen && (
        <Modal onClose={() => setJournalOpen(false)}>
          <h3 style={{ fontWeight:900, color:'#1a1a2e', marginBottom:16 }}>Daily Journal 📓</h3>
          <textarea
            value={journalText}
            onChange={e => setJournalText(e.target.value)}
            placeholder="What's on your mind today…"
            style={{
              width:'100%', height:120, border:'1.5px solid #e0d5f5',
              borderRadius:16, padding:14, fontFamily:'Nunito',
              fontSize:14, resize:'none', outline:'none', color:'#1a1a2e',
            }}
          />
          <motion.button
            whileTap={{ scale:.97 }} onClick={saveJournal}
            style={{
              width:'100%', marginTop:12, padding:'14px 0', borderRadius:50,
              background:'linear-gradient(135deg,#8B5CF6,#7C3AED)',
              color:'#fff', border:'none', fontFamily:'Nunito',
              fontSize:15, fontWeight:800, cursor:'pointer',
            }}
          >
            Save Entry ✓
          </motion.button>
        </Modal>
      )}

      {/* Breathe modal */}
      {breathOpen && (
        <Modal onClose={() => setBreathOpen(false)}>
          <h3 style={{ fontWeight:900, color:'#1a1a2e', textAlign:'center', marginBottom:8 }}>Breathe 🌬️</h3>
          <p style={{ textAlign:'center', color:'#7777aa', fontSize:13, marginBottom:24 }}>Follow the circle — inhale as it grows, exhale as it shrinks.</p>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <motion.div
              animate={{ scale:[1, 1.5, 1] }}
              transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
              style={{
                width:100, height:100, borderRadius:'50%',
                background:'linear-gradient(135deg,#8B5CF6,#c084fc)',
                boxShadow:'0 0 40px rgba(139,92,246,.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:800, fontSize:13,
              }}
            >
              Breathe
            </motion.div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            style={{
              position:'fixed', bottom:100, left:'50%', transform:'translateX(-50%)',
              background:'rgba(139,92,246,.95)', color:'#fff',
              padding:'12px 24px', borderRadius:50, fontWeight:700, fontSize:14,
              zIndex:2000, whiteSpace:'nowrap',
              boxShadow:'0 8px 24px rgba(139,92,246,.4)',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodTracker;
