'use client'
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react'

const userManagement = () => {
    interface User {
        _id: string;
        username: string;
        password: string;
        email: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    }
    
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (!res.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await res.json();
                setUsers(data.users);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    //  console.log(users);
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete user');
            }
            setUsers(users.filter((user) => user._id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) {
                throw new Error('Failed to update user role');
            }
            setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
        } catch (err) {
            setError(err.message);
        }
    };
    return (

        <div className="h-screen flex items-center justify-center">
            <main className="flex flex-col gap-6 w-full h-full pt-40 pb-4 px-12 border border-black">
                <h1 className="font-extrabold text-8xl flex text-left">
                    USER MANAGEMENT
                </h1>
                <div className="h-full w-full border border-cyan-400 p-4">

                    {users.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Username</th>
                                    <th className="py-2 px-4 border-b text-left">Password</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Role</th>
                                    <th className="py-2 px-4 border-b text-left">Created At</th>
                                    <th className="py-2 px-4 border-b text-left">Updated At</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="py-2 px-4 border-b">{user._id}</td>
                                        <td className="py-2 px-4 border-b">{user.username}</td>
                                        <td className="py-2 px-4 border-b">{user.password}</td>
                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                        <td className="py-2 px-4 border-b">{user.role}</td>
                                        <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(user.updatedAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b text-left flex flex-col">
                                            <button
                                                className=" text-blue-500 hover:underline "
                                                onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                            >
                                                {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                            </button>
                                            {/* <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleUpdate(user._id)}
                                            >
                                                Update
                                            </button> */}
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>no users found</p>
                    )}
                </div>



            </main>

        </div>
    )
}

export default userManagement