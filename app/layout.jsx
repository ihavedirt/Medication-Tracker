import {AppProvider} from "@toolpad/core";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import MedicationIcon from '@mui/icons-material/Medication';
import PersonIcon from '@mui/icons-material/Person';
import {PageContainer} from "@toolpad/core/PageContainer";
import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import Image from 'next/image';
import * as React from "react";
import {Dashboard} from "@mui/icons-material";

export const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <Dashboard/>,
    },
    {
        segment: 'dashboard/add-medication',
        title: 'Add User',
        icon: <MedicationIcon/>,
    },
    {
        segment: 'dashboard/add-user',
        title: 'Add User',
        icon: <PersonIcon/>,
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
                    <DashboardLayout>
                        <PageContainer>{children}</PageContainer>
                    </DashboardLayout>
                </AppProvider>
              </AppRouterCacheProvider>
          </body>
      </html>
  )
}
