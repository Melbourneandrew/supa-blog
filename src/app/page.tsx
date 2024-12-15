import { createClient } from '@/utils/supabase/client'

type Post = {
    id: string
    title: string
    content: string
    description: string
    created_at: string
    slug: string
}

export default async function BlogPage() {
    const supabase = createClient()
    const blogTitle = process.env.NEXT_PUBLIC_BLOG_TITLE || 'Your Blog'
    const blogDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION

    // Fetch posts from Supabase
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

    console.log(posts);

    if (error) {
        console.error('Error fetching posts:', error)
        return <div>Error loading posts</div>
    }

    return (
        <main className="container mx-auto px-4">
            <div className="sticky top-0 bg-white py-8 z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{blogTitle}</h1>
                    {blogDescription && (
                        <p className="text-gray-600 text-lg">{blogDescription}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 mb-12">
                {posts?.length === 0 ? (
                    <p className="text-gray-600 text-center">No posts yet!</p>
                ) : (
                    posts?.map((post: Post, index: number) => (
                        <div key={post.id} className="contents">
                            <a
                                href={`/blog/post/${post.slug}`}
                                className="w-full max-w-2xl p-6 hover:bg-gray-100 transition-all duration-200 rounded-lg cursor-pointer no-underline"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-semibold">{post.title}</h2>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{post.description}</p>
                                </div>
                            </a>
                            {index < posts.length - 1 && (
                                <div className="h-[1px] w-full max-w-2xl bg-gray-200"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}
