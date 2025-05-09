'use client';
import { Task } from '@/types/Task.interface';
import { AlertTriangle, ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShowTask({ params }: { params: { id: string } }) {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${params.id}`);
                if (!res.ok) throw new Error('Failed to fetch task');
                const data = await res.json();
                setTask(data);
            } catch (err) {
                setError('Error loading task. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [params.id]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${params.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete task');
            router.push('/tasks');
        } catch (err) {
            setError('Error deleting task. Please try again.');
            console.error(err);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="max-w-xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error || 'Task not found'}
                </div>
                <div className="mt-4">
                    <Link href="/tasks" className="text-blue-600 hover:underline flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to tasks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <Link href="/tasks" className="text-gray-600 hover:text-gray-800 flex items-center mb-6 group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to tasks
            </Link>

            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{task.title}</h1>
                <div className="prose text-gray-700 mb-6">
                    <p>{task.description}</p>
                </div>

                <div className="flex space-x-3">
                    <Link href={`/tasks/${params.id}/edit`}>
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
                            <Edit className="h-5 w-5 mr-2" />
                            Edit
                        </button>
                    </Link>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <div className="flex items-center text-red-600 mb-4">
                            <AlertTriangle className="h-6 w-6 mr-2" />
                            <h2 className="text-xl font-bold">Delete Task</h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-70"
                                disabled={deleting}
                            >
                                {deleting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Trash2 className="h-5 w-5 mr-2" />}
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}