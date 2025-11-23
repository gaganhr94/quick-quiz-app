import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { mode, toggleColorMode } = useColorMode();

    // Decode JWT to get username
    const getUsername = () => {
        if (!token) return '';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Prioritize 'username' claim, fallback to 'sub' or 'user_id'
            return payload.username || payload.sub || payload.user_id || 'User';
        } catch {
            return 'User';
        }
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        handleClose();
        navigate('/login');
    };

    if (!token) return null;

    return (
        <AppBar position="static" sx={{ width: '100%', background: mode === 'dark' ? 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)' : 'linear-gradient(135deg, #A78BFA 0%, #34D399 100%)' }}>
            <Toolbar sx={{ width: '100%' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Quick Quiz
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={toggleColorMode} color="inherit" sx={{ mr: 2 }}>
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <Typography variant="body1" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                        {getUsername()}
                    </Typography>
                    <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={toggleColorMode}>
                            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
