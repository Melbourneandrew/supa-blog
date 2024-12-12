export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center">
                <div className="card bg-base-100 shadow-xl p-8">
                    <h1 className="text-5xl font-bold text-error mb-4">Oops!</h1>
                    <p className="text-xl mb-6">Something went wrong</p>
                    <div className="flex justify-center gap-4">
                        <a href="/" className="btn">
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
