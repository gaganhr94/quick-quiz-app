import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizSuccessPage from './pages/QuizSuccessPage';
import QuizEndPage from './pages/QuizEndPage';
import HostQuizPage from './pages/HostQuizPage';
import JoinQuizPage from './pages/JoinQuizPage';
import QuizPage from './pages/QuizPage';
import Header from './components/Header';
import { NotificationProvider } from './context/NotificationContext';
import theme from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create-quiz" element={<CreateQuizPage />} />
                <Route path="/quiz-success" element={<QuizSuccessPage />} />
                <Route path="/quiz-end" element={<QuizEndPage />} />
                <Route path="/host-quiz" element={<HostQuizPage />} />
                <Route path="/join-quiz/:quizId" element={<JoinQuizPage />} />
                <Route path="/quiz/:quizId" element={<QuizPage />} />
                <Route path="/quiz-admin/:quizId" element={<QuizPage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
