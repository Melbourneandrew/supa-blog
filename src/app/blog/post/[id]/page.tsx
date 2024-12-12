import { createClient } from '@/utils/supabase/client'
import Markdown from 'react-markdown'
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const author = process.env.NEXT_PUBLIC_BLOG_AUTHOR
    const { id: postId } = await params;

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('title, description, content, created_at')
        .eq('id', postId)
        .single()

    if (error || !post) {
        notFound()
    }

    return (
        <article className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-600 mb-8">
                By {author} • {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="prose max-w-none">
                <Markdown>{post.content}</Markdown>
            </div>
        </article>
    )
}
