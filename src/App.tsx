import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import ToastContainer, { type Toast } from './components/ToastContainer';
import { syncQueuedQuestions } from './api/syncService';
import { createLocalQuestion, fetchQuestions, submitQuestionOnline } from './api/questionService';
import AuthPage from './pages/AuthPage';
import AnswersPage from './pages/AnswersPage';
import AskQuestionPage from './pages/AskQuestionPage';
import DashboardPage from './pages/DashboardPage';
import EducationPage from './pages/EducationPage';
import HealthFacilitiesPage from './pages/HealthFacilitiesPage';
import LandingPage from './pages/LandingPage';
import LifeSkillsPage from './pages/LifeSkillsPage';
import CampaignsPage from './pages/CampaignsPage';
import ProfilePage from './pages/ProfilePage';
import CycleTrackerPage from './pages/CycleTrackerPage';
import MentorChatPage from './pages/MentorChatPage';
import AdminHealthPage from './pages/AdminHealthPage';
import type { Question, UserSession } from './types';
import { enqueueQuestion, loadQuestions, loadSession, saveQuestions, saveSession } from './utils/storage';

// Global toast context for cross-page notifications
export { default as ToastContext } from './components/ToastContainer';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('girlcare-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [session, setSession] = useState<UserSession | null>(() => loadSession());
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle('dark', theme === 'dark');
    rootElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('girlcare-theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncNow = () => {
      if (!navigator.onLine) {
        return;
      }

      syncQueuedQuestions()
        .then((syncedItems) => {
          if (syncedItems.length === 0) {
            return;
          }

          setQuestions((prevQuestions) =>
            prevQuestions.map((question) => {
              const synced = syncedItems.find((item) => item.localId === question.id);
              return synced ? synced.serverQuestion : question;
            }),
          );
        })
        .catch(() => {
          // Keep queue for next reconnect attempt.
        });
    };

    syncNow();
    window.addEventListener('online', syncNow);

    return () => {
      window.removeEventListener('online', syncNow);
    };
  }, []);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  useEffect(() => {
    if (questions.length > 0) {
      return;
    }

    let mounted = true;
    fetchQuestions()
      .then((items) => {
        if (mounted && items.length > 0) {
          setQuestions(items);
        }
      })
      .catch(() => {
        // Keep local state if backend is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, [questions.length]);

  const handleLogin = (email: string, isAdmin?: boolean) => {
    setSession({
      email,
      name: email.split('@')[0] || 'User',
      loggedInAt: new Date().toISOString(),
      isAdmin,
    });
  };

  const handleLogout = () => {
    setSession(null);
  };

  const handleSubmitQuestion = async (content: string) => {
    const localId = `offline-${Date.now()}`;

    if (!navigator.onLine) {
      const localQuestion = createLocalQuestion(content, localId);
      enqueueQuestion({
        localId,
        content,
        queuedAt: new Date().toISOString(),
      });
      setQuestions((prevQuestions) => [...prevQuestions, localQuestion]);
      return;
    }

    try {
      const createdQuestion = await submitQuestionOnline({ content });
      setQuestions((prevQuestions) => [...prevQuestions, createdQuestion]);
    } catch {
      const localQuestion = createLocalQuestion(content, localId);
      enqueueQuestion({
        localId,
        content,
        queuedAt: new Date().toISOString(),
      });
      setQuestions((prevQuestions) => [...prevQuestions, localQuestion]);
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <Layout
        isLoggedIn={Boolean(session)}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={session ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <DashboardPage user={session as UserSession} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <EducationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <AskQuestionPage onSubmitQuestion={handleSubmitQuestion} onNotify={addToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/life-skills"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <LifeSkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <CampaignsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/answers"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <AnswersPage questions={questions} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facilities"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <HealthFacilitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <ProfilePage user={session as UserSession} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cycle-tracker"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <CycleTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentors"
            element={
              <ProtectedRoute isLoggedIn={Boolean(session)}>
                <MentorChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-health"
            element={
              <RoleBasedRoute session={session} requiredRole="admin">
                <AdminHealthPage />
              </RoleBasedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
