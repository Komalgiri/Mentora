import React, { useState, useEffect, useRef } from "react";
import moodAvtar from '../assets/moodAvtar.png';
import dreamAvtar from '../assets/dreamAvtar.png';
import relationshipAvtar from '../assets/relationshipAvtar.png';
import stressAvtar from '../assets/stressAvtar.png';
import anxityAvtar from '../assets/anxityAvtar.png';
import { motion, AnimatePresence } from "framer-motion";

const mentors = [
  { name: "Mood Mentor", image: moodAvtar, color: "#FFD700" },
  { name: "Stress Buster", image: stressAvtar, color: "#FF6347" },
  { name: "Dream Weaver", image: dreamAvtar, color: "#9370DB" },
  { name: "Anxiety Ally", image: anxityAvtar, color: "#48D1CC" },
  { name: "Rescuer", image: relationshipAvtar, color: "#FF69B4" } // Shortened name for UI
];

const Chat = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [mentorOptions, setMentorOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMentorGreeting = async (mentorObj) => {
    setIsLoading(true);
    try {
      const response = await fetch("/chatresponse.json");
      const data = await response.json();
      const mentorName = mentorObj.name === "Rescuer" ? "Relationship Rescuer" : mentorObj.name;

      if (!data[mentorName]) return;

      const mentorData = data[mentorName];
      // Start with a clean slate
      setChatHistory([
        { sender: "bot", text: mentorData.greeting },
        { sender: "bot", text: mentorData.question }
      ]);
      setMentorOptions(mentorData.options || []);
    } catch (error) {
      console.error("Error fetching mentor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (selectedMentor) {
      setChatHistory([]);
      setMentorOptions([]);
      setUserInput("");
      fetchMentorGreeting(selectedMentor);
    }
  }, [selectedMentor]);

  const fetchChatbotData = async (mentorObj, userMessage) => {
    try {
      const response = await fetch("/chatresponse.json");
      const data = await response.json();
      const mentorName = mentorObj.name === "Rescuer" ? "Relationship Rescuer" : mentorObj.name;

      if (!data[mentorName]) return;

      const mentorData = data[mentorName];
      const userMessageLower = userMessage.trim().toLowerCase();

      // Deep search helper to find the response for a given message
      const findResponseDeep = (obj) => {
        if (!obj || typeof obj !== 'object') return null;

        // Check if this level has the response directly
        if (obj.responses && obj.responses[userMessage]) return obj.responses[userMessage];
        if (obj.responseMessages && obj.responseMessages[userMessage]) return obj.responseMessages[userMessage];

        // Search through keys for case-insensitive match
        for (let key in obj) {
          if (key.toLowerCase() === userMessageLower) {
            // We found the actual response node or a sub-node
            return obj[key];
          }

          // Recursively search nested objects
          if (typeof obj[key] === 'object') {
            const found = findResponseDeep(obj[key]);
            if (found) return found;
          }
        }
        return null;
      };

      const foundData = findResponseDeep(mentorData);

      if (foundData) {
        // Handle logic for the found data node
        let replyData = foundData.message || foundData.text || foundData;

        // If it's an array of messages, pick one
        if (Array.isArray(replyData) && typeof replyData[0] === 'string') {
          replyData = replyData[Math.floor(Math.random() * replyData.length)];
        }

        const gif = foundData.gif || (typeof replyData === 'object' ? replyData.gif : null);
        const followUp = foundData.followUp || foundData.options || foundData.responseMessages;

        return {
          reply: typeof replyData === 'string' ? replyData : (replyData.text || replyData.message || "I'm listening. Tell me more."),
          gif: gif,
          options: followUp ? (Array.isArray(followUp) ? followUp : Object.keys(followUp)) : []
        };
      }

      return {
        reply: "I see. Tell me more about how that makes you feel.",
        options: mentorData.options // Fallback only if totally lost
      };
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
      return { reply: "I'm momentarily disconnected. Let's try again." };
    }
  };

  const handleOptionClick = async (option) => {
    if (!selectedMentor || isLoading) return; // Prevent double clicks

    setChatHistory((prev) => [...prev, { sender: "user", text: option }]);
    setIsLoading(true);
    setMentorOptions([]);

    setTimeout(async () => {
      const response = await fetchChatbotData(selectedMentor, option);

      let nextOptions = [];
      if (Array.isArray(response.options)) {
        nextOptions = response.options;
      } else if (typeof response.options === 'object') {
        nextOptions = Object.keys(response.options);
      }

      setChatHistory((prev) => [...prev, {
        sender: "bot",
        text: response.reply,
        gif: response.gif
      }]);
      setMentorOptions(nextOptions);
      setIsLoading(false);
    }, 600);
  };

  const handleUserInput = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !selectedMentor || isLoading) return;
    handleOptionClick(userInput);
    setUserInput("");
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "900px",
      height: "75vh",
      background: "rgba(20, 20, 20, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      marginTop: "20px"
    },
    mentorList: {
      display: "flex",
      padding: "15px",
      background: "rgba(255, 255, 255, 0.05)",
      overflowX: "auto",
      gap: "15px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      scrollbarWidth: "none" /* Firefox */
    },
    mentorBtn: (isSelected, color) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      opacity: isSelected ? 1 : 0.6,
      transform: isSelected ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease",
      minWidth: "80px"
    }),
    avatar: (color, isSelected) => ({
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      border: `3px solid ${isSelected ? color : "transparent"}`,
      padding: "2px",
      boxShadow: isSelected ? `0 0 15px ${color}` : "none",
      transition: "all 0.3s"
    }),
    chatArea: {
      flex: 1,
      padding: "20px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    inputArea: {
      padding: "20px",
      background: "rgba(255, 255, 255, 0.05)",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      display: "flex",
      gap: "10px"
    },
    input: {
      flex: 1,
      padding: "12px 20px",
      borderRadius: "30px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      background: "rgba(0, 0, 0, 0.3)",
      color: "white",
      outline: "none",
      fontSize: "1rem"
    },
    sendBtn: {
      background: "#8A2BE2",
      color: "white",
      border: "none",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      boxShadow: "0 4px 15px rgba(138, 43, 226, 0.3)"
    },
    botMsg: {
      alignSelf: "flex-start",
      background: "rgba(255, 255, 255, 0.08)",
      padding: "15px 20px",
      borderRadius: "20px 20px 20px 0",
      maxWidth: "80%",
      color: "#eee",
      fontSize: "0.95rem",
      lineHeight: "1.5",
      border: "1px solid rgba(255, 255, 255, 0.05)"
    },
    userMsg: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
      padding: "15px 20px",
      borderRadius: "20px 20px 0 20px",
      maxWidth: "80%",
      color: "white",
      fontSize: "0.95rem",
      boxShadow: "0 8px 25px rgba(138, 43, 226, 0.2)"
    },
    gifStyle: {
      width: '100%',
      maxWidth: '250px',
      borderRadius: '15px',
      marginTop: '10px',
      display: 'block',
      border: '2px solid rgba(138, 43, 226, 0.2)'
    },
    optionsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "10px"
    },
    optionBtn: {
      background: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#ddd",
      padding: "8px 16px",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "all 0.2s"
    },
    placeholder: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: "#888",
      textAlign: "center"
    }
  };

  return (
    <div style={styles.container}>
      {/* Mentor Selection Row */}
      <div style={styles.mentorList}>
        {mentors.map((mentor) => {
          const isSelected = selectedMentor?.name === mentor.name;
          return (
            <button
              key={mentor.name}
              style={styles.mentorBtn(isSelected, mentor.color)}
              onClick={() => {
                setSelectedMentor(mentor);
                // Force reset even if same mentor
                setChatHistory([]);
                setMentorOptions([]);
                setUserInput("");
                fetchMentorGreeting(mentor);
              }}
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                style={styles.avatar(mentor.color, isSelected)}
              />
              <span style={{ marginTop: "5px", fontSize: "0.8rem", color: isSelected ? "white" : "#aaa" }}>
                {mentor.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {!selectedMentor ? (
          <div style={styles.placeholder}>
            <span style={{ fontSize: "3rem", marginBottom: "20px" }}>👋</span>
            <h3>Select a Mentor to start chatting</h3>
            <p>Each mentor specializes in different areas of well-being.</p>
          </div>
        ) : (
          <AnimatePresence>
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={msg.sender === "bot" ? styles.botMsg : styles.userMsg}
              >
                <div>{msg.text}</div>
                {msg.gif && (
                  <img
                    src={msg.gif}
                    alt="Reaction"
                    style={styles.gifStyle}
                    loading="lazy"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ alignSelf: "flex-start", color: "#aaa", fontSize: "0.9rem", marginLeft: "10px" }}
          >
            Writing...
          </motion.div>
        )}

        {/* Options Chips */}
        {mentorOptions.length > 0 && !isLoading && (
          <div style={styles.optionsContainer}>
            {mentorOptions.map((option, index) => (
              <motion.button
                key={index}
                style={styles.optionBtn}
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </motion.button>
            ))}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form style={styles.inputArea} onSubmit={handleUserInput}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={selectedMentor ? `Message ${selectedMentor.name}...` : "Select a mentor first..."}
          style={styles.input}
          disabled={!selectedMentor}
        />
        <motion.button
          type="submit"
          style={{ ...styles.sendBtn, opacity: !selectedMentor ? 0.5 : 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!selectedMentor}
        >
          ➤
        </motion.button>
      </form>
    </div>
  );
};

export default Chat;
