import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from './components/Toast';

// Pages
import LandingPage from './pages/public/LandingPage';
import UserLogin from './pages/auth/UserLogin';
import UserRegister from './pages/auth/UserRegister';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import UserDashboard from './pages/user/UserDashboard';
import UserSubjectDetails from './pages/user/SubjectDetails';
import QuizPage from './pages/user/QuizPage';
import ResultPage from './pages/user/ResultPage';
import QuizHistory from './pages/user/QuizHistory';
import ProfilePage from './pages/user/ProfilePage';

// Admin Pages
import DashboardHome from './pages/admin/DashboardHome';
import SubjectDetails from './pages/admin/SubjectDetails';
import CreateSubject from './pages/admin/CreateSubject';
import EditSubject from './pages/admin/EditSubject';
import CreateQuizTopic from './pages/admin/CreateQuizTopic';
import EditQuizTopic from './pages/admin/EditQuizTopic';
import QuestionsPage from './pages/admin/QuestionsPage';
import CreateQuestion from './pages/admin/CreateQuestion';
import EditQuestion from './pages/admin/EditQuestion';
import UsersPage from './pages/admin/UsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/subjects/:subjectId"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <UserSubjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/quiz/:quizId"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/results/:attemptId"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/history"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <QuizHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_USER']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <SubjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects/create"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <CreateSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <EditSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/topics/create"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <CreateQuizTopic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/topics/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <EditQuizTopic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <QuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions/create"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <CreateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <EditQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;

