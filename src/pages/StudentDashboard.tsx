import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Shield, Eye, Copy } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const StudentDashboard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [securityWarning, setSecurityWarning] = useState(false);

  // Mock questions
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To replace class components entirely",
        "To add state and lifecycle methods to functional components",
        "To improve performance of React applications",
        "To handle routing in React applications"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Which hook is used to manage component state?",
      options: [
        "useEffect",
        "useState",
        "useContext",
        "useReducer"
      ],
      correct: 1
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleSubmit();
    }
  }, [timeLeft, isAnswered]);

  // Security effects
  useEffect(() => {
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Detect copy attempts
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setSecurityWarning(true);
      setTimeout(() => setSecurityWarning(false), 3000);
    };

    // Detect screenshot attempts (limited detection)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === '4')) {
        setSecurityWarning(true);
        setTimeout(() => setSecurityWarning(false), 3000);
      }
    };

    // Blur on focus loss
    const handleBlur = () => {
      document.body.style.filter = 'blur(5px)';
    };

    const handleFocus = () => {
      document.body.style.filter = 'none';
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
      document.body.style.filter = 'none';
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex.toString());
    }
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(30);
      }
    }, 3000);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      {/* Security Warning */}
      <AnimatePresence>
        {securityWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-xl">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Security Alert: Unauthorized action detected</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Live Poll Session</h1>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure Session</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Monitored</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-8 mb-8">
            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary-400" />
                <span className="text-white font-medium">Time Remaining</span>
              </div>
              <div className={`flex items-center space-x-2 ${timeLeft <= 10 ? 'text-red-400' : 'text-primary-400'}`}>
                <span className="text-2xl font-bold">{timeLeft}s</span>
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(timeLeft / 30) * 100}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{question.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedAnswer === index.toString()
                      ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                      : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500 hover:bg-white/10'
                  } ${
                    showResult && index === question.correct
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : showResult && selectedAnswer === index.toString() && index !== question.correct
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index.toString()
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-600'
                    }`}>
                      {selectedAnswer === index.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && index === question.correct && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {showResult && selectedAnswer === index.toString() && index !== question.correct && (
                      <AlertCircle className="w-5 h-5 text-red-400 ml-auto" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Submit Button */}
            {selectedAnswer && !isAnswered && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
              >
                Submit Answer
              </motion.button>
            )}

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 text-center"
                >
                  {selectedAnswer === question.correct.toString() ? (
                    <div className="text-green-400">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Correct! Well done.</p>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">Incorrect. The correct answer was option {question.correct + 1}.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">85%</div>
            <div className="text-gray-400">Your Accuracy</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">24</div>
            <div className="text-gray-400">Questions Answered</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">2.1s</div>
            <div className="text-gray-400">Avg Response Time</div>
          </GlassCard>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm">
                This session is monitored for security. Screenshot detection and copy protection are active.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;