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
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [editForm, setEditForm] = useState<Ticket | null>(null);
    const [newTicket, setNewTicket] = useState<Ticket>({
        _id: '',
        subject: '',
        description: '',
        status: 'assigned', // assigned, pending, closed
        priority: 'low', // low, medium, high
        assignedUser: 'none',
        createdAt: '',
        updatedAt: ''
    });

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

    const handleEditClick = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setEditForm({ ...ticket }); // Populate form with the current ticket's details
    };
    
    const handleEditChange = (key: keyof Ticket, value: string) => {
        if (editForm) {
            setEditForm({ ...editForm, [key]: value });
        }
    };
    
    const handleSaveEdit = async () => {
        if (editingTicket && editForm) {
            try {
                const res = await fetch(`/api/tickets/${editingTicket._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editForm),
                });
    
                if (!res.ok) {
                    throw new Error('Failed to update ticket');
                }
    
                const updatedTickets = tickets.map((ticket) =>
                    ticket._id === editingTicket._id ? { ...editForm } : ticket
                );
    
                setTickets(updatedTickets);
                setEditingTicket(null);
                setEditForm(null);
            } catch (err: any) {
                setError(err.message);
            }
        }
    };
    
    const handleCancelEdit = () => {
        setEditingTicket(null);
        setEditForm(null);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/tickets?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setTickets(tickets.filter(ticket => ticket._id !== id));
            } else {
                throw new Error('Failed to delete the ticket');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCreateTicket = async () => {
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTicket),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create ticket');
            }

            const data = await res.json();

            setTickets([...tickets, data.ticket]);

            setNewTicket({
                _id: '',
                subject: '',
                description: '',
                status: 'assigned',
                priority: 'low',
                assignedUser: 'none',
                createdAt: '',
                updatedAt: ''
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
                    TICKET MANAGEMENT
                </h1>

                {/* Create Ticket Form */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Create New Ticket</h2>
                    <input
                        type="text"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        placeholder="Subject"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        placeholder="Description"
                        className="border p-2 my-2 w-full"
                    />
                    <select
                        value={newTicket.status}
                        onChange={(e) =>
                            setNewTicket({ ...newTicket, status: e.target.value })
                        }
                        className="border p-2 my-2 w-full"
                    >
                        <option value="assigned">Assigned</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        value={newTicket.priority}
                        onChange={(e) =>
                            setNewTicket({ ...newTicket, priority: e.target.value })
                        }
                        className="border p-2 my-2 w-full"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select
                        value={newTicket.assignedUser}
                        onChange={(e) =>
                            setNewTicket({ ...newTicket, assignedUser: e.target.value })
                        }
                        className="border p-2 my-2 w-full"
                    >
                        <option value="none">None</option>
                        <option value="mrcharm">Mr. Charm</option>
                        <option value="fungeey">Fungeey</option>
                        <option value="deelulu">Deelulu</option>
                        <option value="finchrinch">FinchRinch</option>
                        <option value="bangladesh">Bangladesh</option>
                        <option value="tanim">Tanim</option>
                    </select>
                    <button
                        onClick={handleCreateTicket}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                    >
                        Create Ticket
                    </button>
                </div>

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
                                        {editingTicket?._id === ticket._id ? (
                                            <>
                                                <td colSpan={9} className="py-2 px-4 border-b">
                                                    <input
                                                        type="text"
                                                        value={editForm?.subject || ''}
                                                        onChange={(e) => handleEditChange('subject', e.target.value)}
                                                        placeholder="Subject"
                                                        className="border p-2 my-2 w-full"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editForm?.description || ''}
                                                        onChange={(e) => handleEditChange('description', e.target.value)}
                                                        placeholder="Description"
                                                        className="border p-2 my-2 w-full"
                                                    />
                                                    <select
                                                        value={editForm?.status || 'assigned'}
                                                        onChange={(e) => handleEditChange('status', e.target.value)}
                                                        className="border p-2 my-2 w-full"
                                                    >
                                                        <option value="assigned">Assigned</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                    <select
                                                        value={editForm?.priority || 'low'}
                                                        onChange={(e) => handleEditChange('priority', e.target.value)}
                                                        className="border p-2 my-2 w-full"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                    <select
                                                        value={editForm?.assignedUser || 'none'}
                                                        onChange={(e) => handleEditChange('assignedUser', e.target.value)}
                                                        className="border p-2 my-2 w-full"
                                                    >
                                                        <option value="none">None</option>
                                                        <option value="mrcharm">Mr. Charm</option>
                                                        <option value="fungeey">Fungeey</option>
                                                        <option value="deelulu">Deelulu</option>
                                                        <option value="finchrinch">FinchRinch</option>
                                                        <option value="bangladesh">Bangladesh</option>
                                                        <option value="tanim">Tanim</option>
                                                    </select>
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 hover:bg-gray-700 ml-2"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
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
                                                        onClick={() => handleEditClick(ticket)}
                                                        className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ticket._id)}
                                                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
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