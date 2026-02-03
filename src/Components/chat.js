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

  useEffect(() => {
    if (selectedMentor) {
      setChatHistory([]); // Clear history on mentor switch
      fetchMentorGreeting(selectedMentor);
    }
  }, [selectedMentor]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMentorGreeting = async (mentorObj) => {
    setIsLoading(true);
    try {
      const response = await fetch("/chatresponse.json");
      const data = await response.json();
      const mentorName = mentorObj.name === "Rescuer" ? "Relationship Rescuer" : mentorObj.name; // Mapping back key

      if (!data[mentorName]) return;

      const mentorData = data[mentorName];
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

  const fetchChatbotData = async (mentorObj, userMessage) => {
    try {
      const response = await fetch("/chatresponse.json");
      const data = await response.json();
      const mentorName = mentorObj.name === "Rescuer" ? "Relationship Rescuer" : mentorObj.name;

      if (!data[mentorName]) return;

      const mentorData = data[mentorName];
      const userMessageLower = userMessage.trim().toLowerCase();

      const matchedOption = mentorData.options.find(
        (option) => option.toLowerCase() === userMessageLower
      );

      if (matchedOption) {
        const responseMessage = mentorData.responses?.[matchedOption];
        return responseMessage
          ? { reply: responseMessage.message, options: responseMessage.followUp || responseMessage.responseMessages?.[matchedOption] || [] } // Handle various JSON structures
          : { reply: "I'm not sure about that. Can you pick one of the options below?" };
      }

      // Basic fuzzy check or fallback
      // For now, simple fallback
      return { reply: "I focus on specific topics to help you best. Could you choose an option?", options: mentorData.options };

    } catch (error) {
      console.error("Error fetching chatbot data:", error);
      return { reply: "Something went wrong. Please try again." };
    }
  };

  const handleOptionClick = async (option) => {
    if (!selectedMentor) return;
    setChatHistory((prev) => [...prev, { sender: "user", text: option }]);

    // Simulate thinking delay
    setIsLoading(true);
    setMentorOptions([]); // Hide options while thinking

    setTimeout(async () => {
      const response = await fetchChatbotData(selectedMentor, option);

      // Handle nested response structures if any (simplified here)
      // If response.options is an object, we might need to render keys
      let nextOptions = [];
      if (Array.isArray(response.options)) {
        nextOptions = response.options;
      } else if (typeof response.options === 'object') {
        nextOptions = Object.keys(response.options);
      }

      setChatHistory((prev) => [...prev, { sender: "bot", text: response.reply }]);
      setMentorOptions(nextOptions);
      setIsLoading(false);
    }, 600);
  };

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !selectedMentor) return;
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
      background: "#00AEEF",
      color: "white",
      border: "none",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem"
    },
    botMsg: {
      alignSelf: "flex-start",
      background: "rgba(255, 255, 255, 0.1)",
      padding: "12px 18px",
      borderRadius: "18px 18px 18px 0",
      maxWidth: "80%",
      color: "#eee",
      fontSize: "0.95rem",
      lineHeight: "1.5"
    },
    userMsg: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #00AEEF, #0077b6)",
      padding: "12px 18px",
      borderRadius: "18px 18px 0 18px",
      maxWidth: "80%",
      color: "white",
      fontSize: "0.95rem",
      boxShadow: "0 4px 15px rgba(0, 174, 239, 0.3)"
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
              onClick={() => setSelectedMentor(mentor)}
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
                {msg.text}
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
