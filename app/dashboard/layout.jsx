"use client";
import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import * as React from "react";
import {PageContainer} from "@toolpad/core/PageContainer";
import SignOutButton from "../ui/signout-button";

export default function RootLayout({ children }) {
  return (
        <DashboardLayout slots={{ toolbarActions: SignOutButton }}>
            <PageContainer>{children}</PageContainer>
        </DashboardLayout>
  )
}
