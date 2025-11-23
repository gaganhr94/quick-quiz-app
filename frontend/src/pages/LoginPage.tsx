import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { API_ENDPOINTS } from '../config/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      showNotification('Please enter both username and password', 'error');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        showNotification('Login successful!', 'success');
        navigate('/');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Login failed';

        if (response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (response.status === 404) {
          errorMessage = 'User not found. Please register first.';
        } else if (errorText) {
          errorMessage = errorText;
        }

        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      showNotification('Network error. Please check your connection.', 'error');
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="fade-in"
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Welcome Back
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Link to="/register">
            {"Don't have an account? Register"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
