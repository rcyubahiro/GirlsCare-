import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
import type { Question, UserSession } from './types';
import { enqueueQuestion, loadQuestions, loadSession, saveQuestions, saveSession } from './utils/storage';

function App() {
  const [session, setSession] = useState<UserSession | null>(() => loadSession());
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());

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

  const handleLogin = (email: string) => {
    setSession({
      email,
      name: email.split('@')[0] || 'User',
      loggedInAt: new Date().toISOString(),
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
      <Layout isLoggedIn={Boolean(session)}>
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
                <AskQuestionPage onSubmitQuestion={handleSubmitQuestion} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
