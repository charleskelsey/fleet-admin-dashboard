
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <main className="flex flex-col gap-6 w-full h-full pt-10 pb-10 px-12 border border-black">
                <h1 className="font-bold text-4xl flex justify-center">
                    CONTENT MANAGEMENT
                </h1>
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
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                                            >
                                                Publish
                                            </button>
                                            {/* Placeholder buttons for additional actions */}
                                            {/* <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                                                Edit
                                            </button> */}
                                            {/* <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
                                                Delete
                                            </button> */}
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
