import { createPost } from './actions';
import NewPostButton from './NewPostButton';

export default function NewPost() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            <form className="max-w-2xl">
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Post Title</span>
                    </label>
                    <input
                        name="title"
                        type="text"
                        placeholder="Enter post title"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea
                        name="description"
                        placeholder="Enter a brief description of your post"
                        className="textarea textarea-bordered w-full h-24"
                        required
                    />
                </div>

                <div className="form-control w-full mb-6">
                    <label className="label">
                        <span className="label-text">Content (Markdown)</span>
                    </label>
                    <input
                        name="content"
                        type="file"
                        accept=".md,.markdown"
                        className="file-input file-input-bordered w-full"
                        required
                    />
                </div>

                <NewPostButton formAction={createPost} />
            </form>
        </div>
    );
}
