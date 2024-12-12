'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
const signupsEnabled = process.env.NEXT_PUBLIC_ADMIN_SIGNUP_ENABLED === 'true'

export async function signup(formData: FormData) {
    if (!signupsEnabled) {
        redirect('/error')
    }

    const supabase = await createClient()
    console.log("signup")
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signUp(data)
    console.log(error)
    if (error) {
      redirect('/error')
    }
  
    redirect('/login')
}