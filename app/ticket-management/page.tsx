'use client'
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react'

const ticketManagement = () => {
    interface Ticket {
        _id: string;
        subject: string;
        description: string;
        status: string;
        priority: string;
        assignedUser: string;
        createdAt: string;
        updatedAt: string;
    }
    
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch('/api/tickets');
                if (!res.ok) {
                    throw new Error('Failed to fetch tickets');
                }
                const data = await res.json();
                setTickets(data.tickets);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);
    //  console.log(tickets);
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
                    TICKET MANAGEMENT
                </h1>
                <div className="h-full w-full border border-cyan-400 p-4">

                    {tickets.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Subject</th>
                                    <th className="py-2 px-4 border-b text-left">Description</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Priority</th>
                                    <th className="py-2 px-4 border-b text-left">Assigned User</th>
                                    <th className="py-2 px-4 border-b text-left">Created At</th>
                                    <th className="py-2 px-4 border-b text-left">Updated At</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket._id}>
                                        <td className="py-2 px-4 border-b">{ticket._id}</td>
                                        <td className="py-2 px-4 border-b">{ticket.subject}</td>
                                        <td className="py-2 px-4 border-b">{ticket.description}</td>
                                        <td className="py-2 px-4 border-b">{ticket.status}</td>
                                        <td className="py-2 px-4 border-b">{ticket.priority}</td>
                                        <td className="py-2 px-4 border-b">{ticket.assignedUser}</td>
                                        <td className="py-2 px-4 border-b">{new Date(ticket.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(ticket.updatedAt).toLocaleString()}</td>
                                        <td className="py-4 px-4 border-b text-left flex flex-col">
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                                            >
                                                Assign
                                            </button>
                                            
                                            {/*<button
                                                className=" text-blue-500 hover:underline "
                                                onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                            >
                                                {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                            </button> /** */}
                                            {/* <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleUpdate(user._id)}
                                            >
                                                Update
                                            </button> */}
                                            {/*<button
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>*/}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>no tickets found</p>
                    )}
                </div>



            </main>

        </div>
    )
}

export default ticketManagement