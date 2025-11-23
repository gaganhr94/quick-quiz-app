import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { API_ENDPOINTS } from '../config/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      showNotification('Please enter both username and password', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        showNotification('Registration successful! Please login.', 'success');
        navigate('/login');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Registration failed';

        if (response.status === 409) {
          errorMessage = 'Username already exists. Please choose another.';
        } else if (errorText) {
          errorMessage = errorText;
        }

        showNotification(errorMessage, 'error');
      }
    } catch (error) {
      showNotification('Network error. Please check your connection.', 'error');
      console.error('Registration error:', error);
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
          Create Account
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }} noValidate sx={{ mt: 1, width: '100%' }}>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Link to="/login">
            {"Already have an account? Login"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
