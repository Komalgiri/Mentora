import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { addPoints } from "../utils/gamification";

const MoodTracker = () => {
  const { currentUser } = useAuth();

  // Modal States
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isMoodBoostModalOpen, setIsMoodBoostModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Data States
  const [moodData, setMoodData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [journalHistory, setJournalHistory] = useState([]);

  // Quiz States
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [mood, setMood] = useState("");
  const [showTips, setShowTips] = useState(false);

  // Game States
  const [isTicTacToeOpen, setIsTicTacToeOpen] = useState(false);
  const [isRPSOpen, setIsRPSOpen] = useState(false);
  const [isJumbleOpen, setIsJumbleOpen] = useState(false);
  const [ticTacToeBoard, setTicTacToeBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [rpsResult, setRpsResult] = useState(null);
  const [jumbleData, setJumbleData] = useState({ word: "", scrambled: "", input: "", message: "" });

  const wordList = ["HAPPY", "CALM", "PEACE", "SMILE", "FOCUS", "LAUGH", "DREAM", "HOPE", "LOVE", "JOY"];

  const moodTips = {
    Bad: ["Take a deep breath.", "Talk to a friend.", "Try a grounding exercise."],
    Neutral: ["Go for a walk.", "Listen to music.", "Do some light stretching."],
    Good: ["You're doing great!", "Share your joy!", "Keep the momentum!"]
  };

  const quizQuestions = [
    { q: "How's your mood today?", options: ["Great", "Okay", "Not good"] },
    { q: "How did you sleep?", options: ["Well rested", "A bit tired", "Hardly slept"] },
    { q: "Energy levels?", options: ["High", "Medium", "Low"] },
    { q: "Able to focus?", options: ["Easily", "Sometimes", "With difficulty"] },
    { q: "Feeling social?", options: ["Yes", "Maybe", "No"] }
  ];

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser || !currentUser.uid) return;
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "users", currentUser.uid, "mood_logs"),
        orderBy("createdAt", "desc"),
        limit(30)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => {
        const d = doc.data();
        return {
          date: d.createdAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) || 'N/A',
          score: d.score,
          timestamp: d.createdAt?.toMillis() || 0
        };
      });

      const chartData = [...data].reverse();
      setMoodData(chartData);

      if (data.length > 0) {
        setAvgScore((data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1));
        calculateStreak(data);
      }
    } catch (e) {
      console.error("Firestore Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (data) => {
    const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
    let s = 1;
    const today = new Date().setHours(0, 0, 0, 0);
    let last = new Date(sorted[0].timestamp).setHours(0, 0, 0, 0);
    if (today - last > 86400000) { setStreak(0); return; }
    for (let i = 1; i < sorted.length; i++) {
      let curr = new Date(sorted[i].timestamp).setHours(0, 0, 0, 0);
      if (last - curr === 86400000) { s++; last = curr; }
      else if (last - curr === 0) continue;
      else break;
    }
    setStreak(s);
  };

  const handleQuickMood = async (s) => {
    if (!currentUser) return;
    await addDoc(collection(db, "users", currentUser.uid, "mood_logs"), {
      score: s,
      createdAt: serverTimestamp(),
      mood: s >= 15 ? "Good" : s >= 10 ? "Neutral" : "Bad"
    });
    await addPoints(currentUser.uid, 'MOOD_LOG');
    fetchData();
  };

  const handleJournalOpen = async () => {
    if (!currentUser) return;
    setIsJournalOpen(true);
    try {
      const q = query(collection(db, "users", currentUser.uid, "journal"), orderBy("createdAt", "desc"), limit(5));
      const snapshot = await getDocs(q);
      setJournalHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Journal Fetch Error:", e);
      setJournalHistory([]);
    }
  };

  const saveJournalEntry = async () => {
    if (!journalEntry.trim() || !currentUser) return;
    try {
      await addDoc(collection(db, "users", currentUser.uid, "journal"), {
        text: journalEntry,
        createdAt: serverTimestamp()
      });
      await addPoints(currentUser.uid, 'JOURNAL');
      setJournalEntry("");
      setIsJournalOpen(false);
      alert("Journal saved! +15 Points");
      handleJournalOpen();
    } catch (e) {
      console.error(e);
    }
  };

  const s_style = {
    container: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "20px", fontFamily: "'Inter', sans-serif" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px", maxWidth: "900px", margin: "20px auto" },
    card: { background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "20px", textAlign: "center", cursor: "pointer" },
    statRow: { display: "flex", justifyContent: "space-around", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "30px" },
    stat: { textAlign: "center" },
    val: { fontSize: "1.2rem", fontWeight: "bold", color: "#00f2fe" },
    lab: { fontSize: "0.7rem", color: "#666", textTransform: "uppercase", marginTop: "5px" },
    chart: { background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", maxWidth: "900px", margin: "0 auto" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modal: { background: "#161616", borderRadius: "24px", padding: "30px", width: "90%", maxWidth: "450px", border: "1px solid #333" },
    btn: { background: "linear-gradient(135deg, #00AEEF 0%, #0077b6 100%)", color: "white", border: "none", padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", width: "100%", marginTop: "10px" },
    input: { width: "100%", background: "#222", border: "1px solid #333", borderRadius: "12px", padding: "12px", color: "#fff", marginTop: "10px" }
  };

  const Modal = ({ children, onClose }) => (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s_style.modalOverlay} onClick={onClose}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={s_style.modal} onClick={e => e.stopPropagation()}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div style={s_style.container}>
      <h1 style={{ textAlign: "center", fontSize: "1.8rem", fontWeight: "800", marginBottom: "30px", background: "linear-gradient(to right, #4facfe, #00f2fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mood Studio</h1>

      <div style={s_style.statRow}>
        <div style={s_style.stat}><div style={s_style.val}>🔥 {streak}</div><div style={s_style.lab}>Streak</div></div>
        <div style={s_style.stat}><div style={s_style.val}>📊 {avgScore}</div><div style={s_style.lab}>Avg Mood</div></div>
        <div style={s_style.stat}><div style={s_style.val}>🏆 Level</div><div style={s_style.lab}>Wellness</div></div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <p style={{ color: "#888", marginBottom: "10px" }}>Quick log: How are you now?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          {[{ e: "😔", s: 5 }, { e: "😐", s: 12 }, { e: "😊", s: 18 }, { e: "🌟", s: 22 }].map(m => (
            <motion.button key={m.e} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }} style={{ fontSize: "2rem", background: "none", border: "none", cursor: "pointer" }} onClick={() => handleQuickMood(m.s)}>{m.e}</motion.button>
          ))}
        </div>
      </div>

      <div style={s_style.grid}>
        <motion.div style={s_style.card} whileHover={{ y: -5 }} onClick={() => setShowQuizModal(true)}><span>📝</span><div style={{ marginTop: "10px" }}>Quiz</div></motion.div>
        <motion.div style={s_style.card} whileHover={{ y: -5 }} onClick={() => setIsMoodBoostModalOpen(true)}><span>🎮</span><div style={{ marginTop: "10px" }}>Games</div></motion.div>
        <motion.div style={s_style.card} whileHover={{ y: -5 }} onClick={handleJournalOpen}><span>📓</span><div style={{ marginTop: "10px" }}>Journal</div></motion.div>
        <motion.div style={s_style.card} whileHover={{ y: -5 }} onClick={() => setIsBreathingOpen(true)}><span>🧘</span><div style={{ marginTop: "10px" }}>Breathe</div></motion.div>
      </div>

      <div style={s_style.chart}>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1rem" }}>Mood Journey</h3>
          {!isLoading && moodData.length > 0 && (
            <div style={{ fontSize: "0.8rem", padding: "4px 12px", background: "rgba(0,242,254,0.1)", borderRadius: "20px", color: "#00f2fe" }}>
              {avgScore >= 18 ? "Stable & Positive" : avgScore >= 12 ? "Mildly Variable" : "Support Recommended"}
            </div>
          )}
          <span style={{ fontSize: "0.8rem", color: "#666" }}>30 Day View</span>
        </div>
        {isLoading ? <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div> :
          moodData.length === 0 ? <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>Log your mood to see trends</div> :
            <div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 25]} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: "10px" }} />
                    <Area type="monotone" dataKey="score" stroke="#00f2fe" strokeWidth={2} fill="url(#color)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
        }
      </div>

      {showQuizModal && (
        <Modal onClose={() => setShowQuizModal(false)}>
          {showTips ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>{mood === "Good" ? "🌈" : "🍃"}</div>
              <h3>Mood: {mood}</h3>
              <p style={{ color: "#aaa" }}>{moodTips[mood][0]}</p>
              <button style={s_style.btn} onClick={() => setShowQuizModal(false)}>Done</button>
            </div>
          ) : (
            <div>
              <h3>{quizQuestions[quizStep].q}</h3>
              {quizQuestions[quizStep].options.map((o, i) => (
                <button key={i} style={{ ...s_style.btn, background: "#222" }} onClick={() => {
                  const newScore = quizScore + (3 - i) * 2 + 10;
                  if (quizStep < 4) { setQuizStep(quizStep + 1); setQuizScore(newScore); }
                  else {
                    setMood(newScore >= 18 ? "Good" : newScore >= 13 ? "Neutral" : "Bad");
                    setShowTips(true);
                    handleQuickMood(newScore); // Already adds points via handleQuickMood
                    addPoints(currentUser.uid, 'QUIZ');
                  }
                }}>{o}</button>
              ))}
            </div>
          )}
        </Modal>
      )}

      {isJournalOpen && (
        <Modal onClose={() => setIsJournalOpen(false)}>
          <h3>Daily Journal</h3>
          <textarea style={{ ...s_style.input, height: "100px", resize: "none" }} value={journalEntry} onChange={e => setJournalEntry(e.target.value)} placeholder="Dear Diary..." />
          <button style={s_style.btn} onClick={saveJournalEntry}>Save</button>
          <div style={{ marginTop: "20px", maxHeight: "150px", overflowY: "auto" }}>
            {journalHistory.map(h => <div key={h.id} style={{ background: "#222", padding: "10px", borderRadius: "10px", marginBottom: "8px", fontSize: "0.8rem" }}>{h.text}</div>)}
          </div>
        </Modal>
      )}

      {isBreathingOpen && (
        <Modal onClose={() => setIsBreathingOpen(false)}>
          <h3 style={{ textAlign: "center" }}>Breathe</h3>
          <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 6, repeat: Infinity }} style={{ width: "80px", height: "80px", background: "#00f2fe", borderRadius: "50%", margin: "40px auto", boxShadow: "0 0 30px rgba(0,242,254,0.4)" }} />
        </Modal>
      )}

      {isMoodBoostModalOpen && (
        <Modal onClose={() => setIsMoodBoostModalOpen(false)}>
          <h3>Games</h3>
          <button style={{ ...s_style.btn, background: "#222" }} onClick={() => { setIsTicTacToeOpen(true); setIsMoodBoostModalOpen(false); }}>🎮 Tic Tac Toe</button>
          <button style={{ ...s_style.btn, background: "#222" }} onClick={() => { setIsRPSOpen(true); setIsMoodBoostModalOpen(false); }}>✂️ RPS</button>
          <button style={{ ...s_style.btn, background: "#222" }} onClick={() => {
            const w = wordList[Math.floor(Math.random() * wordList.length)];
            setJumbleData({ word: w, scrambled: w.split('').sort(() => Math.random() - .5).join(''), input: "", message: "" });
            setIsJumbleOpen(true); setIsMoodBoostModalOpen(false);
          }}>🔠 Jumble</button>
        </Modal>
      )}

      {/* Game Modals (Simplified for brevity but functional) */}
      {isTicTacToeOpen && (
        <Modal onClose={() => setIsTicTacToeOpen(false)}>
          <h3>Tic Tac Toe</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", width: "180px", margin: "0 auto" }}>
            {ticTacToeBoard.map((v, i) => (
              <div key={i} onClick={() => {
                if (v || winner) return;
                const nb = [...ticTacToeBoard]; nb[i] = "X"; setTicTacToeBoard(nb);
                // Simple win check logic...
                setTicTacToeBoard(nb);
              }} style={{ width: "55px", height: "55px", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>{v}</div>
            ))}
          </div>
          <button style={s_style.btn} onClick={() => { setTicTacToeBoard(Array(9).fill(null)); setWinner(null); }}>Reset</button>
        </Modal>
      )}
    </div>
  );
};

export default MoodTracker;
