import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import PrivateRoute from './components/PrivateRoute';
// import AnimationManager from './components/AnimationDisabler';

function App() {
  // Set up the application 
  useEffect(() => {
    // Add a style tag for ensuring proper backgrounds
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      body, html, #root {
        background-color: #f1f5f9;
      }
      .bg-background {
        background-color: #f1f5f9;
      }
      .bg-white {
        background-color: #ffffff;
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      // Clean up style tag when component unmounts
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          {/* <AnimationManager /> */}
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-grow bg-background">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/chat/:urlId" element={<ChatPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
