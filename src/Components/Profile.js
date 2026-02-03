import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChartLine, FaMoon, FaSmile, FaChevronLeft, FaStar, FaFire, FaMedal } from 'react-icons/fa';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [moodLogs, setMoodLogs] = useState([]);
    const [gamification, setGamification] = useState({ totalPoints: 0, level: 1 });
    const [correlation, setCorrelation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            fetchAllData();
        }
    }, [currentUser]);

    const fetchAllData = async () => {
        if (!currentUser || !currentUser.uid) return;
        setLoading(true);
        try {
            const mq = query(collection(db, "users", currentUser.uid, "mood_logs"), orderBy("createdAt", "desc"), limit(20));
            const moodSnap = await getDocs(mq);
            const mLogs = moodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMoodLogs(mLogs);

            const statsRef = doc(db, 'users', currentUser.uid, 'stats', 'gamification');
            const statsSnap = await getDoc(statsRef);
            if (statsSnap.exists()) {
                setGamification(statsSnap.data());
            }

            const sq = query(collection(db, "users", currentUser.uid, "sleep_logs"), orderBy("createdAt", "desc"), limit(20));
            const sleepSnap = await getDocs(sq);
            const sLogs = sleepSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            calculateCorrelation(mLogs, sLogs);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateCorrelation = (mLogs, sLogs) => {
        if (mLogs.length < 3 || sLogs.length < 3) return;

        // Group by day - Normalizing dates to YYYY-MM-DD
        const moodMap = {};
        mLogs.forEach(log => {
            if (!log.createdAt) return;
            const date = log.createdAt.toDate();
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!moodMap[dateStr]) moodMap[dateStr] = [];
            moodMap[dateStr].push(log.score);
        });

        const sleepMap = {};
        sLogs.forEach(log => {
            if (!log.createdAt) return;
            const date = log.createdAt.toDate();
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            sleepMap[dateStr] = log.hours;
        });

        let goodSleepMoods = [];
        let badSleepMoods = [];

        Object.keys(sleepMap).forEach(dateStr => {
            if (moodMap[dateStr]) {
                const avgMood = moodMap[dateStr].reduce((a, b) => a + b, 0) / moodMap[dateStr].length;
                if (sleepMap[dateStr] >= 7.5) goodSleepMoods.push(avgMood);
                else badSleepMoods.push(avgMood);
            }
        });
        if (goodSleepMoods.length > 0 && badSleepMoods.length > 0) {
            const goodAvg = goodSleepMoods.reduce((a, b) => a + b, 0) / goodSleepMoods.length;
            const badAvg = badSleepMoods.reduce((a, b) => a + b, 0) / badSleepMoods.length;
            const diff = goodAvg - badAvg;
            setCorrelation({
                goodAvg: goodAvg.toFixed(1),
                badAvg: badAvg.toFixed(1),
                impact: diff > 0 ? `Your mood increases by ${((diff / badAvg) * 100).toFixed(0)}% when you sleep 7.5+ hours.` :
                    "Track more days to see your unique patterns!"
            });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch { console.error("Logout failed"); }
    };

    const nextLevelXP = gamification.level * 100;
    const progressPerc = ((gamification.totalPoints % 100) / 100) * 100;

    const s = {
        container: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '20px', fontFamily: "'Inter', sans-serif" },
        header: { display: 'flex', alignItems: 'center', marginBottom: '30px', maxWidth: '800px', margin: '0 auto 30px' },
        card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '40px', maxWidth: '800px', margin: '0 auto', backdropFilter: 'blur(20px)' },
        avatar: { width: '120px', height: '120px', borderRadius: '40px', background: 'linear-gradient(135deg, #00AEEF, #a8df65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 25px', fontWeight: '800', boxShadow: '0 20px 40px rgba(0, 174, 239, 0.3)' },

        statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' },
        statCard: { background: 'rgba(255,255,255,0.04)', padding: '25px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' },

        progressContainer: { background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '10px', overflow: 'hidden', margin: '20px 0' },
        progressBar: { height: '100%', background: 'linear-gradient(to right, #00AEEF, #a8df65)', borderRadius: '10px' },

        badgeContainer: { display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 0', marginBottom: '40px', scrollbarWidth: 'none' },
        badge: { minWidth: '100px', height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' },

        historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', marginBottom: '12px', border: '1px solid transparent', transition: 'all 0.3s' }
    };

    return (
        <div style={s.container}>
            <div style={s.header}>
                <motion.div whileHover={{ x: -3 }} onClick={() => navigate('/chat')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
                    <FaChevronLeft /> Back
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={s.card}>
                <div style={s.avatar}>{currentUser?.displayName?.[0].toUpperCase() || 'U'}</div>
                <h1 style={{ textAlign: 'center', margin: '0', fontSize: '2rem', fontWeight: '800' }}>{currentUser?.displayName || 'Wellness Seeker'}</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '0.9rem' }}>{currentUser?.email}</p>

                <div style={s.statGrid}>
                    <div style={s.statCard}>
                        <div style={{ color: '#FFD700', fontSize: '1.8rem', marginBottom: '10px' }}><FaTrophy /></div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>Level {gamification.level}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Total XP: {gamification.totalPoints}</div>
                        <div style={s.progressContainer}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPerc}%` }} style={s.progressBar} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#666' }}>{100 - (gamification.totalPoints % 100)} XP to Next Level</span>
                    </div>

                    <div style={s.statCard}>
                        <div style={{ color: '#ff4b2b', fontSize: '1.8rem', marginBottom: '10px' }}><FaFire /></div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>7 Day</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Current Streak</div>
                    </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', color: '#888', letterSpacing: '1px' }}>WELLNESS BADGES</h3>
                <div style={s.badgeContainer}>
                    {[
                        { icon: <FaMedal />, label: 'Early Bird', color: '#4facfe' },
                        { icon: <FaStar />, label: 'Mindful', color: '#f093fb' },
                        { icon: <FaFire />, label: 'On Fire', color: '#ff0844' },
                        { icon: <FaSmile />, label: 'Positive', color: '#00f2fe' }
                    ].map((b, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} style={s.badge}>
                            <div style={{ fontSize: '1.5rem', color: b.color }}>{b.icon}</div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{b.label}</span>
                        </motion.div>
                    ))}
                </div>

                {correlation && (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ background: 'linear-gradient(135deg, rgba(0, 174, 239, 0.08), rgba(168, 223, 101, 0.08))', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '40px' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: '#a8df65', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaChartLine /> PERSONAL INSIGHT
                        </h4>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>{correlation.impact}</p>
                    </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#888', letterSpacing: '1px', margin: 0 }}>RECENT ACTIVITY</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {moodLogs.map((log, i) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                            style={s.historyItem}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {log.score >= 18 ? '😊' : '😐'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>Mood Entry</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{new Date(log.createdAt?.toDate()).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            <span style={{ fontWeight: '800', color: log.score >= 18 ? '#a8df65' : '#00AEEF' }}>+{log.score} XP</span>
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    style={{ background: 'rgba(255, 77, 77, 0.05)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.1)', padding: '18px', borderRadius: '18px', width: '100%', cursor: 'pointer', marginTop: '40px', fontWeight: '700', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,77,77,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,77,77,0.05)'}
                >
                    Log Out of Mentora
                </button>
            </motion.div>

            <style>{`
                div::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default Profile;
