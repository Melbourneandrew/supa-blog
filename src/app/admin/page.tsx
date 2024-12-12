'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import PlusIcon from '@/components/icons/PlusIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import { useRouter } from 'next/navigation';

interface BlogPost {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        console.log(data);

        if (error) {
            console.error('Error fetching posts:', error);
            return;
        }

        setBlogPosts(data || []);
    };

    const handleDelete = async (id: number) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting post:', error);
            return;
        }

        // Refresh the posts list
        fetchBlogPosts();
    };

    const [postToDelete, setPostToDelete] = useState<number | null>(null);

    const openDeleteModal = (id: number) => {
        setPostToDelete(id);
        (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
    };

    const handleAddNew = () => {
        router.push('/admin/new-post');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <a href="/" className="link">Go to blog</a>
                </div>
                <button
                    onClick={handleAddNew}
                    className="btn btn-primary"
                >
                    <PlusIcon />
                    Add New Post
                </button>
            </div>

            <div className="space-y-4">
                {blogPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Add some posts!
                    </div>
                ) : (
                    blogPosts.map((post) => (
                        <div key={post.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body flex-row items-center">
                                <div className="flex-1">
                                    <h2 className="card-title">{post.title}</h2>
                                    <p className="text-sm text-gray-500">Published: {new Date(post.created_at).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => openDeleteModal(post.id)}
                                    className="btn btn-ghost btn-circle"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">Are you sure you want to delete this post? This action cannot be undone.</p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button
                                className="btn btn-error"
                                onClick={() => postToDelete && handleDelete(postToDelete)}
                            >
                                Delete
                            </button>
                            <button className="btn">Cancel</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
