'use client'
import React, { useEffect, useState } from 'react';

const RewardManagement = () => {
    interface Reward {
        _id: string;
        name: string;
        description: string;
        pointsRequired: number;
        status: string;
        category: string;
        expirationDate: string;
        createdAt: string;
        updatedAt: string;
    }

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newReward, setNewReward] = useState<Reward>({
        _id: '',
        name: '',
        description: '',
        pointsRequired: 0,
        status: 'inactive',
        category: '',
        expirationDate: '',
        createdAt: '',
        updatedAt: ''
    });

    // Fetch rewards data
    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await fetch('/api/rewards');
                if (!res.ok) {
                    throw new Error('Failed to fetch rewards');
                }
                const data = await res.json();
                setRewards(data.rewards);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, []);

    // Delete reward
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/rewards?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Remove the deleted reward from the state
                setRewards(rewards.filter(reward => reward._id !== id));
            } else {
                throw new Error('Failed to delete the reward');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Toggle status between 'active' and 'inactive'
    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const res = await fetch(`/api/rewards/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newStatus: newStatus, // Send only the new status
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update status');
            }

            const data = await res.json();

            // Update the status locally
            setRewards(rewards.map(reward =>
                reward._id === id ? { ...reward, status: newStatus } : reward
            ));
        } catch (err: any) {
            console.error("Error updating reward status:", err.message);
            setError(err.message);
        }
    };

    // Update points required for a reward
    const handlePointsUpdate = async (id: string, newPoints: number) => {
        try {
            const res = await fetch(`/api/rewards/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPointsRequired: newPoints, // Send the updated points
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update points');
            }

            // Update points locally
            setRewards(rewards.map(reward =>
                reward._id === id ? { ...reward, pointsRequired: newPoints } : reward
            ));
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Handle new reward creation
    const handleCreateReward = async () => {
        try {
            const res = await fetch('/api/rewards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReward),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create reward');
            }

            const data = await res.json();
            // Add the new reward to the state
            setRewards([...rewards, data.reward]);

            // Clear the form
            setNewReward({
                _id: '',
                name: '',
                description: '',
                pointsRequired: 0,
                status: 'inactive',
                category: '',
                expirationDate: '',
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
                    REWARD MANAGEMENT
                </h1>

                {/* New Reward Form */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold">Create New Reward</h2>
                    <input
                        type="text"
                        value={newReward.name}
                        onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                        placeholder="Reward Name"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newReward.description}
                        onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                        placeholder="Description"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="number"
                        value={newReward.pointsRequired}
                        onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) })}
                        placeholder="Points Required"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        value={newReward.category}
                        onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
                        placeholder="Category"
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="date"
                        value={newReward.expirationDate}
                        onChange={(e) => setNewReward({ ...newReward, expirationDate: e.target.value })}
                        className="border p-2 my-2 w-full"
                    />
                    <button
                        onClick={handleCreateReward}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
                    >
                        Create Reward
                    </button>
                </div>

                <div className="h-full w-full border border-cyan-400 p-4">
                    {rewards.length > 0 ? (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
                                    <th className="py-2 px-4 border-b text-left">Description</th>
                                    <th className="py-2 px-4 border-b text-left">Points Required</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Category</th>
                                    <th className="py-2 px-4 border-b text-left">Expiration Date</th>
                                    <th className="py-2 px-4 border-b text-left">Created At</th>
                                    <th className="py-2 px-4 border-b text-left">Updated At</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rewards.map((reward) => (
                                    <tr key={reward._id}>
                                        <td className="py-2 px-4 border-b">{reward._id}</td>
                                        <td className="py-2 px-4 border-b">{reward.name}</td>
                                        <td className="py-2 px-4 border-b">{reward.description}</td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="number"
                                                value={reward.pointsRequired}
                                                onChange={(e) => {
                                                    const newPoints = parseInt(e.target.value);
                                                    handlePointsUpdate(reward._id, newPoints);
                                                }}
                                                className="border p-1"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">{reward.status}</td>
                                        <td className="py-2 px-4 border-b">{reward.category}</td>
                                        <td className="py-2 px-4 border-b">{new Date(reward.expirationDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(reward.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(reward.updatedAt).toLocaleString()}</td>
                                        <td className="py-4 px-4 border-b text-left flex flex-col">
                                            <button
                                                onClick={() => handleStatusToggle(reward._id, reward.status)}
                                                className={`text-white px-2 py-1 rounded ${reward.status === 'active' ? 'bg-yellow-500' : 'bg-green-500'} hover:bg-opacity-80`}
                                            >
                                                {reward.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(reward._id)}
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
                        <p>No rewards found</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RewardManagement;
