import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import AuthGuard from './components/AuthGuard';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HostDashboard from './pages/HostDashboard';
import OrbitalHostDashboard from './pages/OrbitalHostDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AudioCapture from './pages/AudioCapture';
import AIQuestionFeed from './pages/AIQuestionFeed';
import Participants from './pages/Participants';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoadingProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
              <LoadingScreen />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/host" element={
                  <AuthGuard requiredRole="host">
                    <HostDashboard />
                  </AuthGuard>
                } />
                <Route path="/host/orbital" element={
                  <AuthGuard requiredRole="host">
                    <OrbitalHostDashboard />
                  </AuthGuard>
                } />
                <Route path="/host/audio" element={
                  <AuthGuard requiredRole="host">
                    <AudioCapture />
                  </AuthGuard>
                } />
                <Route path="/host/ai-questions" element={
                  <AuthGuard requiredRole="host">
                    <AIQuestionFeed />
                  </AuthGuard>
                } />
                <Route path="/host/participants" element={
                  <AuthGuard requiredRole="host">
                    <Participants />
                  </AuthGuard>
                } />
                <Route path="/host/leaderboard" element={
                  <AuthGuard requiredRole="host">
                    <Leaderboard />
                  </AuthGuard>
                } />
                <Route path="/host/reports" element={
                  <AuthGuard requiredRole="host">
                    <Reports />
                  </AuthGuard>
                } />
                <Route path="/host/settings" element={
                  <AuthGuard requiredRole="host">
                    <Settings />
                  </AuthGuard>
                } />
                <Route path="/student" element={
                  <AuthGuard requiredRole="student">
                    <StudentDashboard />
                  </AuthGuard>
                } />
                <Route path="/" element={<LoginPage />} />
              </Routes>
            </div>
          </Router>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;