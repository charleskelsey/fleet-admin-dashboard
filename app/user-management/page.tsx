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
    const [error, setError] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState<Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password: string }>({
        username: '',
        password: '',
        email: '',
        role: 'user',
    });

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
    
    const handleEdit = (user: User) => {
        setEditUser(user);
    };

    const handleUpdate = async () => {
        if (!editUser) return;

        try {
            const res = await fetch(`/api/users?id=${editUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser),
            });

            if (!res.ok) throw new Error('Failed to update user');

            const updatedUser = await res.json();
            setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
            setEditUser(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

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

    const handleCreateUser = async () => {
        try {
            const { password, ...userWithoutIds } = newUser;

            const res = await fetch(`/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create user');
            }

            const data = await res.json();
            setUsers([...users, data.user]);

            setNewUser({
                username: '',
                password: '',
                email: '',
                role: 'user',
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
                    USER MANAGEMENT
                </h1>

                {/* Create User Form */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Create New User</h2>
                    <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Username"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Password"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                        className="border p-2 my-2 w-full"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="border p-2 my-2 w-full"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        onClick={handleCreateUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                    >
                        Create User
                    </button>
                </div>

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
                                                className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-700"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
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

                {editUser && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md">
                            <h2>Edit User</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate();
                                }}
                            >
                                <label>
                                    Username:
                                    <input
                                        type="text"
                                        value={editUser.username}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, username: e.target.value })
                                        }
                                        className="border p-2"
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, email: e.target.value })
                                        }
                                        className="border p-2"
                                    />
                                </label>
                                <label>
                                    Role:
                                    <select
                                        value={editUser.role}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, role: e.target.value })
                                        }
                                        className="border p-1"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </label>
                                <div className="mt-4">
                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 ml-2 rounded hover:bg-gray-700"
                                        onClick={() => setEditUser(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>

        </div>
    )
}

export default userManagement