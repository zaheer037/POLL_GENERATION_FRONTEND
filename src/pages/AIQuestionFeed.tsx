"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Check, X, Edit3, Clock, Settings, Filter, Play } from "lucide-react"
import DashboardLayout from "../components/DashboardLayout"
import GlassCard from "../components/GlassCard"
import AIControlPanel from "../components/AIControlPanel"

const AIQuestionFeed = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 100) // Show settings icon after scrolling 100px
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To replace class components entirely",
        "To add state and lifecycle methods to functional components",
        "To improve performance of React applications",
        "To handle routing in React applications",
      ],
      correct: 1,
      difficulty: "Medium",
      tags: ["React", "Hooks", "Functional Components"],
      confidence: 92,
      status: "pending",
      timeEstimate: "30s",
    },
    {
      id: 2,
      question: "Which method is used to update state in a functional component?",
      options: ["this.setState()", "useState()", "updateState()", "setState()"],
      correct: 1,
      difficulty: "Easy",
      tags: ["React", "State", "useState"],
      confidence: 89,
      status: "pending",
      timeEstimate: "25s",
    },
    {
      id: 3,
      question: "What is the correct way to handle side effects in React?",
      options: ["componentDidMount", "useEffect", "useCallback", "useMemo"],
      correct: 1,
      difficulty: "Medium",
      tags: ["React", "Side Effects", "useEffect"],
      confidence: 95,
      status: "approved",
      timeEstimate: "35s",
    },
  ])

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [autoLaunch, setAutoLaunch] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [defaultTimer, setDefaultTimer] = useState(30)
  const [filterSettings, setFilterSettings] = useState({
    difficulty: "all",
    tags: [],
    minConfidence: 80,
  })
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false)

  const handleApprove = (id: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status: "approved" } : q)))
  }

  const handleReject = (id: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status: "rejected" } : q)))
  }

  const handleEdit = (id: number) => {
    setSelectedQuestion(id)
    setIsEditMode(true)
  }

  const handleLaunch = (id: number) => {
    console.log("Launching question:", id)
    // Implementation for launching question
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "Hard":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "rejected":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "pending":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const filteredQuestions = questions.filter((q) => {
    if (filterSettings.difficulty !== "all" && q.difficulty !== filterSettings.difficulty) {
      return false
    }
    if (q.confidence < filterSettings.minConfidence) {
      return false
    }
    return true
  })

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Question Feed</h1>
            <p className="text-gray-400">Review and manage AI-generated questions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
              {filteredQuestions.filter((q) => q.status === "pending").length} Pending
            </div>
            {/* Only show AI Config button when not scrolled */}
            {!isScrolled && (
              <motion.button
                onClick={() => setIsControlPanelOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg border border-primary-500/30 hover:bg-primary-500/30 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Settings className="w-4 h-4" />
                <span>AI Config</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Settings */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <select
                  value={filterSettings.difficulty}
                  onChange={(e) => setFilterSettings((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-white/10 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all" className="bg-gray-800">
                    All Levels
                  </option>
                  <option value="Easy" className="bg-gray-800">
                    Easy
                  </option>
                  <option value="Medium" className="bg-gray-800">
                    Medium
                  </option>
                  <option value="Hard" className="bg-gray-800">
                    Hard
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Confidence: {filterSettings.minConfidence}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={filterSettings.minConfidence}
                  onChange={(e) =>
                    setFilterSettings((prev) => ({ ...prev, minConfidence: Number.parseInt(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Auto-Launch Settings */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Auto-Launch Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Enable Auto-Launch</label>
                <button
                  onClick={() => setAutoLaunch(!autoLaunch)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                    autoLaunch ? "bg-primary-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                      autoLaunch ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Timer Enabled</label>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                    timerEnabled ? "bg-primary-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                      timerEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Timer: {defaultTimer}s</label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={defaultTimer}
                  onChange={(e) => setDefaultTimer(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Questions</span>
                <span className="text-white font-medium">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Approved</span>
                <span className="text-green-400 font-medium">
                  {questions.filter((q) => q.status === "approved").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Pending</span>
                <span className="text-yellow-400 font-medium">
                  {questions.filter((q) => q.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg Confidence</span>
                <span className="text-white font-medium">
                  {Math.round(questions.reduce((acc, q) => acc + q.confidence, 0) / questions.length)}%
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Question Queue */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Question Queue</h3>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg border border-white/10 p-6 hover:border-white/20 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}
                        >
                          {question.difficulty}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(question.status)}`}
                        >
                          {question.status}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Brain className="w-4 h-4" />
                          <span className="text-xs">{question.confidence}% confidence</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">{question.timeEstimate}</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-medium text-white mb-3">{question.question}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded-lg text-sm ${
                              optionIndex === question.correct
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-white/5 text-gray-300 border border-gray-600"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        {question.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {question.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleApprove(question.id)}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReject(question.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(question.id)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      {question.status === "approved" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLaunch(question.id)}
                          className="p-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors duration-200"
                        >
                          <Play className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
      <AIControlPanel
        isOpen={isControlPanelOpen}
        onToggle={() => setIsControlPanelOpen(!isControlPanelOpen)}
        showFloatingButton={isScrolled}
      />
    </DashboardLayout>
  )
}

export default AIQuestionFeed
