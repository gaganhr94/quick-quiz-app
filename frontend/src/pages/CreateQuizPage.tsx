import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, FormControl, Radio, RadioGroup, FormControlLabel, Card, CardContent, IconButton, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

// Define types for Quiz, Question, and Option for type safety
interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  options: Option[];
}

interface Quiz {
  title: string;
  questions: Question[];
}

export default function CreateQuizPage() {
  const [quiz, setQuiz] = useState<Quiz>({ title: '', questions: [] });
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      text: '',
      options: Array(4).fill({ text: '', isCorrect: false }),
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...quiz.questions];
    if (newQuestions[qIndex].options.length < 6) {
      newQuestions[qIndex].options.push({ text: '', isCorrect: false });
      setQuiz({ ...quiz, questions: newQuestions });
    }
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...quiz.questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);
      setQuiz({ ...quiz, questions: newQuestions });
    }
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const newQuestions = quiz.questions.filter((_, index) => index !== qIndex);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleQuestionChange = (qIndex: number, text: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].text = text;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = { ...newQuestions[qIndex].options[oIndex], text };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options.forEach((option, index) => {
      option.isCorrect = index === oIndex;
    });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async () => {
    // Validation
    if (!quiz.title.trim()) {
      showNotification('Please enter a quiz title', 'error');
      return;
    }

    if (quiz.questions.length === 0) {
      showNotification('Please add at least one question', 'error');
      return;
    }

    for (const q of quiz.questions) {
      if (!q.text.trim()) {
        showNotification('All questions must have text', 'error');
        return;
      }
      if (q.options.some(o => !o.text.trim())) {
        showNotification('All options must have text', 'error');
        return;
      }
      if (!q.options.some(o => o.isCorrect)) {
        showNotification('Each question must have a correct answer', 'error');
        return;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('You must be logged in to create a quiz', 'error');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quiz),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/quiz-success?quizId=${data.id}&title=${encodeURIComponent(quiz.title)}`);
      } else {
        const error = await response.text();
        showNotification(`Failed to create quiz: ${error}`, 'error');
      }
    } catch (error) {
      showNotification('An error occurred while creating the quiz', 'error');
    }
  };


  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }} className="fade-in">
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Create a New Quiz
        </Typography>
        <Paper elevation={0} sx={{ p: 4, mb: 4, background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Paper>

        {quiz.questions.map((q, qIndex) => (
          <Card key={qIndex} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Question {qIndex + 1}</Typography>
                <IconButton onClick={() => handleRemoveQuestion(qIndex)}><DeleteIcon /></IconButton>
              </Box>
              <TextField
                fullWidth
                label="Question Text"
                value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                sx={{ my: 2 }}
              />
              <FormControl component="fieldset">
                <RadioGroup>
                  {q.options.map((o, oIndex) => (
                    <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        value={oIndex.toString()}
                        control={<Radio checked={o.isCorrect} onChange={() => handleCorrectOptionChange(qIndex, oIndex)} />}
                        label=""
                      />
                      <TextField
                        fullWidth
                        label={`Option ${oIndex + 1}`}
                        value={o.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      />
                      <IconButton onClick={() => handleRemoveOption(qIndex, oIndex)} disabled={q.options.length <= 2}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </RadioGroup>
                <Button startIcon={<AddIcon />} onClick={() => handleAddOption(qIndex)} disabled={q.options.length >= 6} sx={{ mt: 1 }}>
                  Add Option
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddQuestion}>
          Add Question
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          Save Quiz
        </Button>
      </Box>
    </Container>
  );
}
