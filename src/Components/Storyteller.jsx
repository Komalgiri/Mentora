import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti"; // Import the Confetti library

// Reward pool
const rewardPool = [
  {
    type: "🧘‍♀️ You unlocked Calmness!",
    content: "Take a deep breath. You're doing great. 🌱",
  },
  {
    type: "🌟 You gained Confidence!",
    content: "Believe in yourself. You're capable of amazing things.",
  },
  {
    type: "🔥 Energy Boost!",
    content: "Keep going, you're on fire today! 🚀",
  },
  {
    type: "🎨 Creative Spark!",
    content: "Let your imagination flow and create something beautiful.",
  },
];

const CubeFace = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      width: "150px",
      height: "150px",
      backgroundColor: "#e53935",
      opacity: 0.95,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1rem",
      ...style,
    }}
  >
    {children}
  </div>
);

const MindBox = () => {
  const [opened, setOpened] = useState(false);
  const [drop, setDrop] = useState(null);
  const [openCount, setOpenCount] = useState(0); // Track number of times opened
  const [showConfetti, setShowConfetti] = useState(false); // Control the confetti animation
  const [specialUnlock, setSpecialUnlock] = useState(false); // Track special unlock

  const handleOpen = () => {
    if (opened) return;
  
    const newCount = openCount + 1;
    setOpenCount(newCount);
  
    // Trigger confetti and special unlock on the third open
    if (newCount === 3) {
      setSpecialUnlock(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Confetti disappears after 4 seconds
    } else {
      const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];
      setDrop(reward);
    }
  
    setOpened(true);
  
    setTimeout(() => {
      setOpened(false);
      setDrop(null); // Clear the drop to avoid ghost rewards
    }, 1800);
  };
  
  return (
    <div style={{ textAlign: "center", padding: "3rem", background: "#000", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2.5rem", color: "white" }}>✨ MindBox</h1>
      <p style={{ color: "white", marginBottom: "2rem", fontSize: "1.2rem" }}>
        Open your daily soul drop and receive something magical for your spirit ✨
      </p>

      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Cube with "Open Me" */}
      <motion.div
        onClick={handleOpen}
        whileTap={{ scale: 1.05 }}
        style={{ perspective: "1000px", display: "inline-block", cursor: "pointer" }}
      >
        <motion.div
          animate={opened ? { y: -20, scale: 1.1 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          style={{
            position: "relative",
            width: "150px",
            height: "150px",
            transformStyle: "preserve-3d",
            transform: "rotateX(20deg) rotateY(20deg)",
          }}
        >
          <CubeFace style={{ transform: "translateZ(75px)" }}>Open Me</CubeFace>
          <CubeFace style={{ transform: "rotateY(180deg) translateZ(75px)" }} />
          <CubeFace style={{ transform: "rotateY(-90deg) translateZ(75px)" }} />
          <CubeFace style={{ transform: "rotateY(90deg) translateZ(75px)" }} />
          <CubeFace style={{ transform: "rotateX(-90deg) translateZ(75px)" }} />
        </motion.div>
      </motion.div>

      {/* Special Unlock Animation */}
      {/* Special Unlock Animation */}
{specialUnlock && (
  <motion.div
    animate={{
      scale: [1, 1.5, 1], // Gradual growth
      opacity: [0, 1, 1],  // Fade in effect
      rotate: [0, 360],    // Slight rotation for added elegance
    }}
    transition={{ duration: 2, ease: "easeOut" }}
    style={{
      position: "absolute",
      width: "120px",
      height: "120px",
      backgroundColor: "transparent",
      transformOrigin: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: "50%",
      left: "50%",
      marginTop: "-60px",
      marginLeft: "-60px",
      borderRadius: "50%",
      border: "5px solid #ffd700", // Golden border for the reward effect
      boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)", // Glow effect for emphasis
      color: "#ffd700", // Gold color for text
      fontWeight: "bold",
      fontSize: "1.25rem",
      backgroundImage: "url('https://www.iconsdb.com/icons/preview/gold/star-xxl.png')", // Star icon as background (or any icon you prefer)
      backgroundSize: "60px",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <p style={{ margin: 0 }}>✨ Unlocked! ✨</p>
  </motion.div>
)}



      {/* Reward Drop */}
      <AnimatePresence>
        {drop && (
          <motion.div
            key={drop.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "15px",
              padding: "1.5rem",
              margin: "2rem auto 0",
              color: "#fff",
              maxWidth: "400px",
              boxShadow: "0 0 15px rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ color: "#ffd700", fontSize: "1.25rem" }}>{drop.type}</h3>
            <p style={{ marginTop: "1rem" }}>{drop.content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindBox;
