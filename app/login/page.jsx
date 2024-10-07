import { login, signup } from './actions'
import {SignInPage} from "@toolpad/core/SignInPage";

export default function LoginPage() {
    return (
        <SignInPage signIn={login} providers={[{ id: 'credentials', name: 'Email and Password' }]}/>
    )
}