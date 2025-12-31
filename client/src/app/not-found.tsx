import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 max-w-md w-full text-center">
                <div className="bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="w-10 h-10 text-blue-500" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
                <p className="text-gray-400 mb-8">We couldn't find the page you were looking for. However, admissions are currently open!</p>

                <div className="space-y-4">
                    <a
                        href="https://forms.gle/BgrejR14F9jmB4FJ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
                    >
                        Apply for Admission
                    </a>

                    <Link
                        href="/"
                        className="block w-full py-4 bg-zinc-800 rounded-xl font-bold text-gray-300 hover:bg-zinc-700 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
