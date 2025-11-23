import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Grid, Paper, Chip, Avatar, LinearProgress } from '@mui/material';
import { useWebSocket } from '../hooks/useWebSocket';
import { EmojiEvents as TrophyIcon, Person as PersonIcon, Timer as TimerIcon } from '@mui/icons-material';
import { useColorMode } from '../context/ThemeContext';

export default function QuizPage() {
    const { quizId: rawQuizId } = useParams();
    const quizId = rawQuizId?.trim(); // Fix potential whitespace issues
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const name = searchParams.get('name');
    const isAdmin = !name;
    const { mode } = useColorMode();

    const [participants, setParticipants] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [gameState, setGameState] = useState('waiting');
    const [quizStarted, setQuizStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

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
                setSelectedOption(null);
                setQuizStarted(true);
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
                const sortedLeaderboard = msg.payload.sort((a: any, b: any) => b.score - a.score);
                const leaderboardParam = encodeURIComponent(JSON.stringify(sortedLeaderboard));
                navigate(`/quiz-end?leaderboard=${leaderboardParam}`);
                break;
            default:
                break;
        }
    }

    const { sendMessage } = useWebSocket(quizId || '', name || undefined, handleMessage);

    useEffect(() => {
        if (name) {
            sendMessage({ type: 'join', payload: name });
        }
    }, [name, sendMessage]);

    const handleAnswer = (optionIndex: number) => {
        if (selectedOption !== null) return; // Prevent multiple answers
        setSelectedOption(optionIndex);
        sendMessage({ type: 'answer', payload: { optionIndex, name } });
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        sendMessage({ type: 'start' });
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="fade-in">
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #7C3AED, #DB2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {isAdmin ? 'Hosting Quiz' : 'Playing Quiz'}
                </Typography>
                {isAdmin && (
                    <Chip
                        icon={<PersonIcon />}
                        label={`${participants.length} Participant${participants.length !== 1 ? 's' : ''}`}
                        color="primary"
                        variant="outlined"
                    />
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Main Content Area */}
                <Grid item xs={12} md={isAdmin && !quizStarted ? 8 : 12}>
                    <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 4,
                        background: mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                        {/* Waiting State */}
                        {gameState === 'waiting' && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {isAdmin ? 'Ready to Start?' : 'Waiting for Host...'}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                                    {isAdmin ? 'Wait for players to join, then click start.' : 'The quiz will begin shortly. Get ready!'}
                                </Typography>
                                {isAdmin && !quizStarted && (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleStartQuiz}
                                        sx={{
                                            px: 6,
                                            py: 2,
                                            fontSize: '1.2rem',
                                            borderRadius: 2,
                                            background: 'linear-gradient(45deg, #7C3AED, #DB2777)',
                                            boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.5)'
                                        }}
                                    >
                                        Start Quiz
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Question State */}
                        {gameState === 'question' && currentQuestion && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Chip label="Question" color="secondary" size="small" />
                                    {timeRemaining !== null && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimerIcon color={timeRemaining <= 10 ? 'error' : 'primary'} />
                                            <Typography variant="h5" fontWeight="bold" color={timeRemaining <= 10 ? 'error.main' : 'primary.main'}>
                                                {timeRemaining}s
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                                    {currentQuestion.text}
                                </Typography>

                                {timeRemaining !== null && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={(timeRemaining / 30) * 100}
                                        sx={{
                                            mb: 4,
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: timeRemaining <= 10 ? 'error.main' : 'primary.main'
                                            }
                                        }}
                                    />
                                )}

                                <Grid container spacing={2}>
                                    {currentQuestion.options.map((option: any, index: number) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Button
                                                fullWidth
                                                variant={selectedOption === index ? "contained" : "outlined"}
                                                onClick={() => handleAnswer(index)}
                                                disabled={isAdmin || selectedOption !== null}
                                                sx={{
                                                    height: '100%',
                                                    py: 3,
                                                    fontSize: '1.1rem',
                                                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                                    justifyContent: 'flex-start',
                                                    textAlign: 'left',
                                                    px: 3,
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        bgcolor: mode === 'dark' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)'
                                                    }
                                                }}
                                            >
                                                <Box component="span" sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    border: '2px solid currentColor',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {String.fromCharCode(65 + index)}
                                                </Box>
                                                {option.text}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>

                                {isAdmin && (
                                    <Box sx={{ mt: 4, textAlign: 'right' }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => sendMessage({ type: 'next_question' })}
                                            size="large"
                                        >
                                            Next Question
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Leaderboard State */}
                        {gameState === 'leaderboard' && (
                            <Box>
                                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
                                    Leaderboard
                                </Typography>
                                <List>
                                    {leaderboard.map((p, index) => (
                                        <ListItem key={p.name}
                                            sx={{
                                                bgcolor: p.name === name ? 'rgba(124, 58, 237, 0.2)' : (mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                                                mb: 2,
                                                borderRadius: 3,
                                                border: p.name === name ? '1px solid #7C3AED' : 'none',
                                                p: 2
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Typography variant="h5" sx={{ width: 50, fontWeight: 'bold', color: index < 3 ? '#F59E0B' : 'text.secondary' }}>
                                                    #{index + 1}
                                                </Typography>
                                                <Avatar sx={{ bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'primary.main', mr: 2 }}>
                                                    {p.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <ListItemText
                                                    primary={<Typography variant="h6">{p.name}</Typography>}
                                                    secondary={<Typography variant="body2" color="text.secondary">{p.score} points</Typography>}
                                                />
                                                {index < 3 && <TrophyIcon sx={{ color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32', fontSize: 32 }} />}
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                                {isAdmin && (
                                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => sendMessage({ type: 'next_question' })}
                                            sx={{ px: 6 }}
                                        >
                                            Next Question
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Participants Sidebar (Only for Admin & Before Start) */}
                {isAdmin && !quizStarted && (
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            borderRadius: 4,
                            background: mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                            height: '100%'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="primary" /> Players Joined
                            </Typography>
                            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {participants.map((p, index) => (
                                    <ListItem key={index} sx={{ py: 1, px: 0 }}>
                                        <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.9rem', bgcolor: 'secondary.main' }}>
                                            {p.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <ListItemText primary={p.name} />
                                    </ListItem>
                                ))}
                                {participants.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                        Waiting for players to join...
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
