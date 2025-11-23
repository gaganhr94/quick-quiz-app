import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
import { Container, Box, Typography, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

interface Quiz {
  id: string;
  title: string;
}

export default function HostQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [hostedQuizId, setHostedQuizId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.quizzes, {
      headers: {
        'Authorization': `Bearer ${token} `
      }
    })
      .then((res) => res.json())
      .then((data) => setQuizzes(data || [])); // Ensure quizzes is always an array
  }, []);

  const handleHostQuiz = (id: string) => {
    setHostedQuizId(id);
  };

  const getJoinUrl = () => {
    if (!hostedQuizId) return '';
    return window.location.origin + `/ join - quiz / ${hostedQuizId} `;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }} className="fade-in">
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Host a Quiz
        </Typography>
        {hostedQuizId ? (
          <Paper elevation={0} sx={{ p: 4, background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'secondary.main' }}>
                Quiz is Live!
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Join Link: <Link to={`/ join - quiz / ${hostedQuizId} `}>{getJoinUrl()}</Link>
              </Typography>
              <QRCode value={getJoinUrl()} />
              <Button component={Link} to={`/ quiz - admin / ${hostedQuizId} `} variant="contained" size="large" sx={{ mt: 4 }}>
                Start and Manage Quiz
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ background: 'transparent' }}>
            <List>
              {quizzes.map((quiz) => (
                <ListItem key={quiz.id}
                  sx={{
                    mb: 2,
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateX(5px)', background: 'rgba(30, 41, 59, 0.9)' }
                  }}
                  secondaryAction={
                    <Button variant="contained" onClick={() => handleHostQuiz(quiz.id)}>Host</Button>
                  }
                >
                  <ListItemText primary={quiz.title} primaryTypographyProps={{ variant: 'h6' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
