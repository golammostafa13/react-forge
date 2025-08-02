import { useState } from "react";

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    createdAt: Date;
}

export default function Challenge1() {
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: 1, text: "Complete project proposal", completed: false, priority: 'high', createdAt: new Date() },
        { id: 2, text: "Review team feedback", completed: false, priority: 'medium', createdAt: new Date() },
        { id: 3, text: "Update documentation", completed: false, priority: 'low', createdAt: new Date() },
        { id: 4, text: "Schedule team meeting", completed: true, priority: 'medium', createdAt: new Date() },
    ]);
    const [draggedOver, setDraggedOver] = useState<number | null>(null);
    const [newTodo, setNewTodo] = useState('');
    const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, itemId: number) => {
        event.dataTransfer.setData("text/plain", itemId.toString());
    };

    const handleDragEnd = () => {
        setDraggedOver(null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, itemId: number) => {
        event.preventDefault();
        setDraggedOver(itemId);
    };

    const handleDragLeave = () => {
        setDraggedOver(null);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetItemId: number) => {
        event.preventDefault();
        setDraggedOver(null);
        const draggedItemId = parseInt(event.dataTransfer.getData("text/plain"));

        if (draggedItemId !== targetItemId) {
            const newTodos = [...todos];
            const draggedItemIndex = newTodos.findIndex((item) => item.id === draggedItemId);
            const targetItemIndex = newTodos.findIndex((item) => item.id === targetItemId);

            const [draggedItem] = newTodos.splice(draggedItemIndex, 1);
            newTodos.splice(targetItemIndex, 0, draggedItem);

            setTodos(newTodos);
        }
    };

    const addTodo = () => {
        if (newTodo.trim()) {
            const todo: TodoItem = {
                id: Date.now(),
                text: newTodo.trim(),
                completed: false,
                priority: newPriority,
                createdAt: new Date()
            };
            setTodos([...todos, todo]);
            setNewTodo('');
        }
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 border-red-300 text-red-800';
            case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'low': return 'bg-green-100 border-green-300 text-green-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };
    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Priority Todo Manager</h2>
                <p className="text-gray-600 mb-6">Drag and drop to reorder tasks by priority. Most important tasks at the top!</p>

                {/* Add Todo Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex gap-3 mb-3">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new task..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <button
                            onClick={addTodo}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                    {todos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No tasks yet. Add your first task above!
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`p-4 rounded-lg cursor-move transition-all duration-200 shadow-sm border ${draggedOver === todo.id
                                    ? "scale-105 shadow-lg border-blue-400 bg-blue-50"
                                    : todo.completed
                                        ? "bg-gray-50 border-gray-200 opacity-60"
                                        : "bg-white border-gray-200 hover:shadow-md"
                                    }`}
                                draggable={!todo.completed}
                                onDragStart={(e) => handleDragStart(e, todo.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, todo.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, todo.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleComplete(todo.id)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'} font-medium`}>
                                                {todo.text}
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                                                {todo.priority}
                                            </span>
                                        </div>
                                    </div>
                                    {!todo.completed && (
                                        <span className="text-gray-400 text-sm">⋮⋮</span>
                                    )}
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                        title="Delete task"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{todos.filter(t => !t.completed).length}</span> pending •
                        <span className="font-medium ml-1">{todos.filter(t => t.completed).length}</span> completed •
                        <span className="font-medium ml-1">{todos.length}</span> total
                    </div>
                </div>
            </div>
        </div>
    );
}
