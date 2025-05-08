'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

type Task = {
    id: number
    title: string
    description: string
    status: string
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error('Failed to fetch tasks:', err))
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Task List</h1>
            <div className="grid gap-4">
                {tasks.map(task => (
                    <Card key={task.id} className="p-4">
                        <h2 className="text-lg font-semibold">{task.title}</h2>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        <span className="text-xs uppercase font-bold text-blue-600">{task.status}</span>
                    </Card>
                ))}
            </div>
        </div>
    )
}
