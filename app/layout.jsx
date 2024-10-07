"use client";
import {AppProvider} from "@toolpad/core/AppProvider";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import MedicationIcon from '@mui/icons-material/Medication';
import PersonIcon from '@mui/icons-material/Person';
import Image from 'next/image';
import * as React from "react";
import {Dashboard} from "@mui/icons-material";
import {createTheme} from "@mui/material";

export const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <Dashboard/>,
    },
    {
        segment: 'dashboard/add-medication',
        title: 'Add Medication',
        icon: <MedicationIcon/>,
    },
    {
        segment: 'dashboard/add-user',
        title: 'Add User',
        icon: <PersonIcon/>,
    }
];

const commonSettings = {
    shape: {
        borderRadius: 8,
    }
};

const lightTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#ff9800',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#757575',
        },
        error: {
            main: '#d32f2f',
        },
        success: {
            main: '#388e3c',
        },
        warning: {
            main: '#f57c00',
        },
        info: {
            main: '#0288d1',
        },
    },
});


const darkTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#ffb74d',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
        error: {
            main: '#ef5350',
        },
        success: {
            main: '#66bb6a',
        },
        warning: {
            main: '#ffa726',
        },
        info: {
            main: '#29b6f6',
        },
    },
});

export default function RootLayout({ children }) {
  return (
      <html lang="en" data-toolpad-color-scheme="light">
          <body>
              <AppRouterCacheProvider options={{enableCssLayer: true}}>
                <AppProvider branding={{
                    logo: <Image src="/neohand.png" alt="Pocket Pills Logo" width={72} height={144} />,
                    title: 'Pocket Pills',
                }} navigation={NAVIGATION} theme={{light: lightTheme, dark:darkTheme}}>
                    {children}
                </AppProvider>
              </AppRouterCacheProvider>
          </body>
      </html>
  )
}
