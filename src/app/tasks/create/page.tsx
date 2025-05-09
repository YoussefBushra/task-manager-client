'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTaskPage() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [dueDate, setDueDate] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                status,
                due_date: dueDate || null,
            }),
        });

        if (response.ok) {
            router.push('/tasks');
        } else {
            const data = await response.json();
            if (data.errors) {
                setErrors(data.errors);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Create a New Task</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block font-semibold mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
                </div>

                {/* Due Date */}
                <div>
                    <label className="block font-semibold mb-1">Due Date</label>
                    <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date[0]}</p>}
                </div>

                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}
