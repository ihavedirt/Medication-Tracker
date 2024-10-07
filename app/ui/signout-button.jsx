'use client';

import Button from "@mui/material/Button";
import {signout} from "../login/actions";
import * as React from "react";

export default function SignOutButton() {
    return (
        <Button variant="contained" onClick={() => {
            signout();
        }}>Sign Out</Button>
    );
}