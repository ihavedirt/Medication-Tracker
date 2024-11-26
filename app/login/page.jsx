"use client";
import { login, signup } from './actions'
import {SignInPage} from "@toolpad/core/SignInPage";
import Link from '@mui/material/Link';

function SignUpLink() {
    return (
        <Link href="/login/signup" variant="body2">
            Sign up
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