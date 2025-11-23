import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { EmojiEvents as TrophyIcon, Home } from '@mui/icons-material';

interface Participant {
    name: string;
    score: number;
}

export default function QuizEndPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const leaderboardData = searchParams.get('leaderboard');
    const [leaderboard, setLeaderboard] = useState<Participant[]>([]);

    useEffect(() => {
        if (leaderboardData) {
            try {
                const data = JSON.parse(decodeURIComponent(leaderboardData));
                setLeaderboard(data.sort((a: Participant, b: Participant) => b.score - a.score));
            } catch (error) {
                console.error('Failed to parse leaderboard data', error);
            }
        }
    }, [leaderboardData]);

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    const getPodiumHeight = (index: number) => {
        if (index === 0) return 200; // 1st place
        if (index === 1) return 150; // 2nd place
        return 120; // 3rd place
    };

    const getTrophyColor = (index: number) => {
        if (index === 0) return '#FFD700'; // Gold
        if (index === 1) return '#C0C0C0'; // Silver
        return '#CD7F32'; // Bronze
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>

            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" fontWeight="bold" gutterBottom sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                }}>
                    Quiz Complete! 🎉
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    Congratulations to all participants!
                </Typography>
            </Box>

            {/* Podium for Top 3 */}
            {top3.length > 0 && (
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold">
                        Top 3 Winners
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: 2,
                        mt: 4,
                        flexWrap: 'wrap'
                    }}>
                        {/* Reorder to show 2nd, 1st, 3rd */}
                        {[1, 0, 2].map((originalIndex) => {
                            const participant = top3[originalIndex];
                            if (!participant) return null;

                            return (
                                <Box
                                    key={originalIndex}
                                    sx={{
                                        textAlign: 'center',
                                        animation: 'fadeIn 0.5s ease-in',
                                        animationDelay: `${originalIndex * 0.2}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>
                                        <TrophyIcon sx={{
                                            fontSize: originalIndex === 0 ? 80 : 60,
                                            color: getTrophyColor(originalIndex),
                                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                        }} />
                                    </Box>
                                    <Paper
                                        elevation={originalIndex === 0 ? 8 : 4}
                                        sx={{
                                            height: getPodiumHeight(originalIndex),
                                            width: 180,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: originalIndex === 0
                                                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)'
                                                : 'rgba(30, 41, 59, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: `2px solid ${getTrophyColor(originalIndex)}`,
                                            borderRadius: 2,
                                            position: 'relative'
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            top: -15,
                                            bgcolor: getTrophyColor(originalIndex),
                                            color: 'black',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            border: '3px solid white'
                                        }}>
                                            {originalIndex + 1}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                                            {participant.name}
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold" color="primary">
                                            {participant.score}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            points
                                        </Typography>
                                    </Paper>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}

            {/* Rest of the leaderboard */}
            {rest.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" textAlign="center" gutterBottom fontWeight="bold">
                        Full Leaderboard
                    </Typography>
                    <Paper elevation={3} sx={{
                        p: 3,
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                    }}>
                        <List>
                            {rest.map((participant, index) => (
                                <ListItem
                                    key={participant.name}
                                    sx={{
                                        mb: 1,
                                        bgcolor: 'rgba(124, 58, 237, 0.1)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(124, 58, 237, 0.3)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography variant="h6" sx={{ width: 50, color: 'text.secondary' }}>
                                            #{index + 4}
                                        </Typography>
                                        <ListItemText
                                            primary={participant.name}
                                            secondary={`${participant.score} points`}
                                            primaryTypographyProps={{ fontWeight: 'medium', fontSize: 18 }}
                                        />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Back to Home
                </Button>
            </Box>
        </Container>
    );
}
