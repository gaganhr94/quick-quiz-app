import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material';
import { CheckCircle, Home, PlayArrow } from '@mui/icons-material';

export default function QuizSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const quizId = searchParams.get('quizId');
    const quizTitle = searchParams.get('title');

    return (
        <Container component="main" maxWidth="md" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center', background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 4 }} className="fade-in">
                <Box sx={{ mb: 4 }}>
                    <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Quiz Created Successfully!
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                        "{quizTitle}"
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your quiz has been saved and is ready to be hosted.
                    </Typography>
                </Box>

                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{ py: 1.5 }}
                        >
                            Go to Home
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<PlayArrow />}
                            onClick={() => navigate('/host-quiz')}
                            sx={{ py: 1.5 }}
                        >
                            Host This Quiz
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
