import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import Detect from './pages/Detect';
import Diseases from './pages/Diseases';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AudioProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-300">
              
              {/* Toast Alerts Notification Manager */}
              <Toaster 
                position="top-center" 
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: '16px',
                    background: '#1F2937',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: 'Noto Sans Ethiopic, sans-serif'
                  }
                }}
              />
              
              {/* Header Navigation bar */}
              <Navbar />
              
              {/* Main Content Router */}
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/detect" element={<Detect />} />
                  <Route path="/diseases" element={<Diseases />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/history" 
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Fallback redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global Audio Controller floating player */}
              <AudioPlayer />
              
            </div>
          </AudioProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
