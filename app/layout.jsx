"use client";
import {AppProvider} from "@toolpad/core/AppProvider";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import MedicationIcon from '@mui/icons-material/Medication';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Image from 'next/image';
import * as React from "react";
import {Article, Dashboard} from "@mui/icons-material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

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
    },
    
    {
        segment: 'dashboard/view-user',
        title: 'View Users',
        icon: <SupervisorAccountIcon/>,
    },
    
    {
        segment: 'dashboard/export-pdf',
        title: 'Export Medication History',
        icon: <Article/>,
    }
];

export default function RootLayout({ children }) {
  return (
      <html lang="en" data-toolpad-color-scheme="light">
          <body>
              <AppRouterCacheProvider options={{enableCssLayer: true}}>
                <AppProvider branding={{
                    logo: <Image src="/neohand.png" alt="Pocket Pills Logo" width={72} height={144} />,
                    title: 'Pocket Pills',
                }} navigation={NAVIGATION}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {children}
                    </LocalizationProvider>
                </AppProvider>
              </AppRouterCacheProvider>
          </body>
      </html>
  )
}
