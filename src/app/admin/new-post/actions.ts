'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get('title');
    const content = formData.get('content') as File;
    const description = formData.get('description');

    if (!title || !content || !description) {
        throw new Error('Missing required fields');
    }

    const markdownContent = await content.text();

    try {
        const { error } = await supabase
            .from('blog_posts')
            .insert({
                title: title,
                content: markdownContent,
                description: description,
            });

        if (error) throw error;
        
        revalidatePath('/admin');
        revalidatePath('/blog');
    } catch (error) {
        console.error('Error saving post:', error);
        throw new Error('Failed to create post');
    }
    redirect('/admin');
}