'use client';
import { Task } from '@/types/Task.interface';
import { ClipboardList, Edit, Eye, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TaskListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
                if (!res.ok) throw new Error('Failed to fetch tasks');
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                setError('Error loading tasks. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <ClipboardList className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                </div>
                <Link href="/tasks/create">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>New Task</span>
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks yet</h3>
                    <p className="text-gray-500 mb-4">Create your first task to get started</p>
                    <Link href="/tasks/create">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                            Create Task
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow bg-white flex justify-between items-center"
                        >
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {task.title}
                                    {task.status && (
                                        <span className="ml-2 text-sm font-normal text-gray-500">({task.status})</span>
                                    )}
                                </h2>
                                <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                                <Link href={`/tasks/${task.id}`}>
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="View task">
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </Link>
                                <Link href={`/tasks/${task.id}/edit`}>
                                    <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors" title="Edit task">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}