'use client';

import Button from "@mui/material/Button";
import {signout} from "../login/actions";
import * as React from "react";
import {useState} from "react";

export default function SignOutButton() {
    const [loading, setLoading] = useState(false);
    return (
        <Button variant="contained" disabled={loading} onClick={() => {
            setLoading(true);
            signout().finally(() => {
                setLoading(false);
            });
        }}>Sign Out</Button>
    );
}