"use client";
import { login, signup } from './actions'
import {SignInPage} from "@toolpad/core/SignInPage";
import { Link, Button } from '@mui/material';

function SignUpLink() {
    return (
        <Link href="/login/signup" passHref>
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
            >
                Not Registered? Sign Up
            </Button>
        </Link>
    );
}

export default function LoginPage() {
    return (
        <SignInPage 
            signIn={login} 
            providers={[{ id: 'credentials', name: 'Email and Password' }]}
            slots={{
                signUpLink: SignUpLink,
              }}
        />
    )
}