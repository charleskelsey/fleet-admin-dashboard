'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const contentManagement = () => {
    interface Content {
        _id: string;
        title: string;
        description: string;
        type: string;
        author: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }
    
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newContent, setNewContent] = useState<Content>({
        _id: '',
        title: '',
        description: '',
        type: '',
        author: '',
        status: 'draft',
        createdAt: '',
        updatedAt: ''
    });
    
    useEffect(() => {
        const fetchContents = async () => {
            try {
                const res = await fetch('/api/contents');
                if (!res.ok) {
                    throw new Error('Failed to fetch content');
                }
                const data = await res.json();
                setContents(data.content);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContents();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/contents?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setContents(contents.filter(content => content._id !== id));
            } else {
                throw new Error('Failed to delete the reward');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'draft' ? 'live' : 'draft';
        try {
            const res = await fetch(`/api/contents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newStatus: newStatus,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update status');
            }

            const data = await res.json();

            setContents(contents.map(content =>
                content._id === id ? { ...content, status: newStatus } : content
            ));
        } catch (err: any) {
            console.error("Error updating content status:", err.message);
            setError(err.message);
        }
    };

    const handleCreateContent = async () => {
        try {
            const { title, description, type, author } = newContent;
    
            if (!title || !description || !type || !author) {
                setError("All fields are required");
                return;
            }
    
            const res = await fetch('/api/contents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, type, author }),
            });
    
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create content');
            }
    
            const data = await res.json();
    
            setContents([...contents, data.content]);
    
            setNewContent({
                _id: '',
                title: '',
                description: '',
                type: '',
                author: '',
                status: 'draft',
                createdAt: '',
                updatedAt: '',
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <main className="flex flex-col gap-6 w-full h-full pt-10 pb-10 px-12 border-black">
                <h1 className="font-bold text-4xl flex justify-center">
                    CONTENT MANAGEMENT
                </h1>

                {/* New Content Form */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Create New Content</h2>
                    <input
                        type="text"
                        value={newContent.title}
                        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                        placeholder="Title"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newContent.description}
                        onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                        placeholder="Description"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newContent.type}
                        onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                        placeholder="Type"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newContent.author}
                        onChange={(e) => setNewContent({ ...newContent, author: e.target.value })}
                        placeholder="Author"
                        className="border p-2 my-2 w-full"
                    />
                    <button
                        onClick={handleCreateContent}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                    >
                        Create Content
                    </button>
                </div>

                <div className="h-full w-full border border-cyan-400 p-4">

                    {contents.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Title</th>
                                    <th className="py-2 px-4 border-b text-left">Description</th>
                                    <th className="py-2 px-4 border-b text-left">Type</th>
                                    <th className="py-2 px-4 border-b text-left">Author</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    
                                    <th className="py-2 px-4 border-b text-left">Created At</th>
                                    <th className="py-2 px-4 border-b text-left">Updated At</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contents.map((content) => (
                                    <tr key={content._id}>
                                        <td className="py-2 px-4 border-b">{content._id}</td>
                                        <td className="py-2 px-4 border-b">{content.title}</td>
                                        <td className="py-2 px-4 border-b">{content.description}</td>
                                        <td className="py-2 px-4 border-b">{content.type}</td>
                                        <td className="py-2 px-4 border-b">{content.author}</td>
                                        <td className="py-2 px-4 border-b">{content.status}</td>
                                      
                                        <td className="py-2 px-4 border-b">{new Date(content.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(content.updatedAt).toLocaleString()}</td>
                                        <td className="py-4 px-4 border-b text-left flex flex-col">
                                            <button
                                                onClick={() => handleStatusToggle(content._id, content.status)}
                                                className={`text-white px-2 py-1 rounded ${content.status === 'draft' ? 'bg-green-500' : 'bg-yellow-500'} hover:bg-opacity-80`}
                                            >
                                                {content.status === 'draft' ? 'Publish' : 'Draft'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(content._id)}
                                                className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No content found</p>
                    )}
                </div>
            </main>
        </div>
    )
}

export default contentManagement;
