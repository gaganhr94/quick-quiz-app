import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

export default function JoinQuizPage() {
  const [name, setName] = useState('');
  const { quizId } = useParams();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim()) {
      navigate(`/quiz/${quizId}?name=${name.trim()}`);
    } else {
      alert('Please enter your name.');
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
          Join Quiz
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleJoin(); }} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Join
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
