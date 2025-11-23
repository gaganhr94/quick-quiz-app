import React, { createContext, useContext, useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';

interface ColorModeContextType {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'dark',
    toggleColorMode: () => { },
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('colorMode');
        return (savedMode as PaletteMode) || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('colorMode', mode);
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
            {children}
        </ColorModeContext.Provider>
    );
};
