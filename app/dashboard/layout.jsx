import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import * as React from "react";
import {PageContainer} from "@toolpad/core";

export default function RootLayout({ children }) {
  return (
        <DashboardLayout>
            <PageContainer>{children}</PageContainer>
        </DashboardLayout>
  )
}
