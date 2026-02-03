import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const QuestionAns = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem('questionAns_current');
    return saved ? JSON.parse(saved) : 1;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('questionAns_answers');
    return saved ? JSON.parse(saved) : Array(5).fill('');
  });

  useEffect(() => {
    localStorage.setItem('questionAns_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('questionAns_current', JSON.stringify(currentQuestion));
  }, [currentQuestion]);

  const questions = [
    { question: 'What are 5 things you can see around you?', options: [] },
    { question: 'What are 4 things you can hear right now?', options: ['Birds', 'Traffic', 'Music', 'Silence'] },
    { question: 'What are 3 things you can feel?', options: [] },
    { question: 'What are 2 things you can smell?', options: ['Coffee', 'Perfume', 'Flowers', 'Food'] },
    { question: 'What is 1 thing you can taste?', options: [] },
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion - 1] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion - 1] = option;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
    // Logic to finish/save can go here
    navigate('/chat/self-care');
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)', // Calm green gradient
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#fff',
      position: 'relative',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '10px',
      textAlign: 'center',
    },
    progressBarContainer: {
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '3px',
      marginBottom: '30px',
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#fff',
      transition: 'width 0.3s ease'
    },
    questionText: {
      fontSize: '1.4rem',
      marginBottom: '30px',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    input: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.3)',
      background: 'rgba(0,0,0,0.2)',
      color: '#fff',
      fontSize: '1.1rem',
      outline: 'none',
      marginBottom: '20px'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '20px'
    },
    optionBtn: {
      padding: '14px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    activeOptionBtn: {
      background: '#fff',
      color: '#000',
      fontWeight: 'bold'
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px'
    },
    navBtn: {
      padding: '12px 24px',
      borderRadius: '30px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'transform 0.1s'
    },
    prevBtn: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    nextBtn: {
      background: '#fff',
      color: '#1f4037',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    closeBtn: {
      position: 'absolute',
      top: '20px',
      right: '25px',
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '1.5rem',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button style={styles.closeBtn} onClick={() => navigate('/chat')}>&times;</button>

        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, width: `${(currentQuestion / questions.length) * 100}%` }} />
        </div>

        <h2 style={styles.title}>Grounding Exercise</h2>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuestion}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p style={styles.questionText}>{questions[currentQuestion - 1].question}</p>

            {questions[currentQuestion - 1].options.length > 0 ? (
              <div style={styles.optionsGrid}>
                {questions[currentQuestion - 1].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      ...styles.optionBtn,
                      ...(answers[currentQuestion - 1] === option ? styles.activeOptionBtn : {})
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                rows={3}
                value={answers[currentQuestion - 1]}
                onChange={handleAnswerChange}
                placeholder="Type your observations here..."
                style={styles.input}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div style={styles.navContainer}>
          <button
            onClick={handlePrevious}
            style={{ ...styles.navBtn, ...styles.prevBtn, visibility: currentQuestion === 1 ? 'hidden' : 'visible' }}
          >
            Previous
          </button>

          {currentQuestion === questions.length ? (
            <button
              onClick={handleFinish}
              style={{ ...styles.navBtn, ...styles.nextBtn }}
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{ ...styles.navBtn, ...styles.nextBtn }}
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionAns;
