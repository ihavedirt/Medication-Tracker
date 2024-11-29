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

    console.log(formData);
    const data = {
        email: formData.email,
        password: formData.password,
        options: {
            data: {
              phone: formData.phoneNumber,
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error);
        redirect('/error')
    }

    await supabase.from("user_data").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phoneNumber
    });

    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
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