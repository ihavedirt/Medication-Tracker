'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export async function login(provider, formData) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (error) {
        return {error: error.message};
    }

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}

export async function signup(provider, formData) {
    const supabase = createClient();

    const data = {
        email: formData.email,
        password: formData.password
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error);
        redirect('/error')
    }
}

export async function signout() {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }

    revalidatePath('/login', 'layout')
    redirect('/login')
}