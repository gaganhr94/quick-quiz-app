import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Quiz as QuizIcon, Add as AddIcon, Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';

export default function HomePage() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
        className="fade-in"
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 4, fontSize: { xs: '3rem', md: '5rem' } }}>
          Quick Quiz
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 6, color: 'text.secondary', maxWidth: '600px' }}>
          The ultimate platform for hosting and joining interactive quizzes in real-time.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {isAuthenticated ? (
            <>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    borderRadius: 4,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <QuizIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>Host a Quiz</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Launch a quiz and invite participants to join via QR code or link.
                  </Typography>
                  <Button component={Link} to="/host-quiz" variant="contained" size="large" fullWidth>
                    Start Hosting
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 4,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <AddIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>Create Quiz</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Design your own quizzes with custom questions and options.
                  </Typography>
                  <Button component={Link} to="/create-quiz" variant="outlined" color="secondary" size="large" fullWidth>
                    Create New
                  </Button>
                </Paper>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <LoginIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>Login</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Access your account to manage and host quizzes.
                  </Typography>
                  <Button component={Link} to="/login" variant="contained" size="large" fullWidth>
                    Login
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <RegisterIcon sx={{ fontSize: 60, color: 'secondary.light', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>Register</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Create a new account to start creating your own quizzes.
                  </Typography>
                  <Button component={Link} to="/register" variant="outlined" color="secondary" size="large" fullWidth>
                    Register
                  </Button>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
