import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Grid, Paper } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

export default function QuizPage() {
    const { quizId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const name = searchParams.get('name');
    const isAdmin = !name;

    const [participants, setParticipants] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [gameState, setGameState] = useState('waiting');
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    const handleMessage = (msg: any) => {
        switch (msg.type) {
            case 'participants':
                setParticipants(msg.payload);
                break;
            case 'question':
                setGameState('question');
                setCurrentQuestion(msg.payload);
                setLeaderboard([]);
                setTimeRemaining(msg.payload.timeRemaining || 30);
                break;
            case 'leaderboard':
                setGameState('leaderboard');
                setLeaderboard(msg.payload.sort((a: any, b: any) => b.score - a.score));
                setTimeRemaining(null);
                break;
            case 'timer':
                setTimeRemaining(msg.payload);
                break;
            case 'quiz_end':
                // Navigate to quiz end page with leaderboard data
                const sortedLeaderboard = msg.payload.sort((a: any, b: any) => b.score - a.score);
                const leaderboardParam = encodeURIComponent(JSON.stringify(sortedLeaderboard));
                navigate(`/ quiz - end ? leaderboard = ${leaderboardParam} `);
                break;
            default:
                break;
        }
    }

    const { sendMessage } = useWebSocket(quizId, name, handleMessage);

    useEffect(() => {
        if (name) {
            sendMessage({ type: 'join', payload: name });
        }
    }, [name, sendMessage]);

    const handleAnswer = (optionIndex: number) => {
        sendMessage({ type: 'answer', payload: { optionIndex, name } });
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        sendMessage({ type: 'start' });
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Participants</Typography>
                        <List>
                            {participants.map(p => <ListItem key={p.name}><ListItemText primary={p.name} /></ListItem>)}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        {isAdmin && (
                            <Box sx={{ mb: 2 }}>
                                {!quizStarted && (
                                    <Button variant="contained" onClick={handleStartQuiz} sx={{ mr: 1 }}>Start Quiz</Button>
                                )}
                                {quizStarted && gameState !== 'waiting' && (
                                    <Button variant="contained" color="secondary" onClick={() => sendMessage({ type: 'next_question' })}>Next Question</Button>
                                )}
                            </Box>
                        )}

                        {gameState === 'waiting' && (
                            <Typography variant="h5">Waiting for the quiz to start...</Typography>
                        )}

                        {gameState === 'question' && currentQuestion && (
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h5" component="div">
                                            {currentQuestion.text}
                                        </Typography>
                                        {timeRemaining !== null && (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                bgcolor: timeRemaining <= 10 ? 'error.main' : 'primary.main',
                                                color: 'white',
                                                px: 2,
                                                py: 1,
                                                borderRadius: 2,
                                                minWidth: 80,
                                                justifyContent: 'center'
                                            }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {timeRemaining}s
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Grid container spacing={2}>
                                        {currentQuestion.options.map((option: any, index: number) => (
                                            <Grid item xs={6} key={option.id}>
                                                <Button fullWidth variant="outlined" onClick={() => handleAnswer(index)} disabled={isAdmin}>
                                                    {option.text}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {gameState === 'leaderboard' && (
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>Leaderboard</Typography>
                                    <List>
                                        {leaderboard.map((p, index) => (
                                            <ListItem key={p.name}
                                                sx={{
                                                    bgcolor: p.name === name ? 'rgba(124, 58, 237, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    border: p.name === name ? '1px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.1)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <Typography variant="h6" sx={{ width: 40, color: index < 3 ? '#F59E0B' : 'text.secondary' }}>
                                                        {index + 1}
                                                    </Typography>
                                                    {index < 3 && <TrophyIcon sx={{ color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32', mr: 2 }} />}
                                                    <ListItemText
                                                        primary={p.name}
                                                        secondary={`Score: ${p.score} `}
                                                        primaryTypographyProps={{ fontWeight: p.name === name ? 'bold' : 'regular' }}
                                                    />
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
