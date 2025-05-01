import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';


const MyLinks = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    const fetchLinks = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/link/fetchAll`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })

            if (!response.ok) throw new Error('Unauthorized or Server Error');

            const data = await response.json();

            setLinks(Array.isArray(data) ? data : []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (linkId) => {

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/link/deleteLink/${linkId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setLinks(prev => prev.filter(link => link._id !== linkId));
                toast.success("Link deleted successfully");
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            toast.error(err.message || "Error deleting the link");
        }
    }

    useEffect(() => {
        fetchLinks();
        const interval = setInterval(fetchLinks, 3000);
        return () => clearInterval(interval);

    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(true)
        }, 20);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-[#0a0c16] via-[#0c0f1e] to-[#080910] text-white transition-all duration-300">
            <h2 className="text-3xl mt-4 font-bold text-center text-teal-400 mb-8 tracking-wide drop-shadow-lg">
                My Links
            </h2>

            {loading ? (
                <div className="text-center text-sky-400 animate-pulse">Loading your links...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : links.length === 0 ? (
                <div className="text-center text-slate-400">No links created yet. Create one!</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                    {links
                        .filter(link => !link.expireAt || new Date(link.expireAt) > new Date())
                        .map((link) => (
                            <div
                                key={link._id}
                                className="relative bg-white/5 border border-[#2d3748] backdrop-blur-md p-5 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-400 hover:scale-[1.03]"
                            >
                                {/* Short Link */}
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-orange-300 mb-1">Short Link</p>
                                    <a
                                        href={`${import.meta.env.VITE_BASE_URL}/link/${link.shortUrl || link.customAlias}`}
                                        target="_blank"
                                        className="text-sm text-cyan-300 underline break-all hover:text-blue-300 transition-colors duration-200"
                                    >
                                        {`${import.meta.env.VITE_BASE_URL}/link/${link.customAlias || link.shortUrl}`}
                                    </a>
                                </div>

                                {/* Original URL */}
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-emerald-300 mb-1">Original URL</p>
                                    <a
                                        href={link.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-400 underline break-all hover:text-cyan-200 transition-colors duration-200"
                                    >
                                        {link.originalUrl}
                                    </a>
                                </div>

                                {/* Created At */}
                                <div className="mb-3">
                                    <p className="text-sm text-lime-300 font-semibold mb-1">Created At</p>
                                    <p className="text-sm text-gray-400">
                                        {link.createdAt ? new Date(link.createdAt).toLocaleString() : 'Unknown'}
                                    </p>
                                </div>

                                {/* Expiry Date */}
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-fuchsia-300 mb-1">Expiry Date</p>
                                    <p className="text-sm text-gray-400">
                                        {link.expireAt ? new Date(link.expireAt).toLocaleString() : 'Never'}
                                    </p>
                                </div>

                                {/* Click Count */}
                                <div>
                                    <p className="text-sm font-semibold text-rose-300 mb-1">Click Count</p>
                                    <p className="text-sm text-pink-400">{link.clicks || 0}</p>
                                </div>

                                    <button onClick={() => handleDelete(link._id)}
                                        className={" text-sm absolute bottom-4 right-4 w-9 h-9 flex justify-center items-center bg-orange-400 hover:bg-red-500 rounded-full text-white transition-all duration-300"}
                                    >
                                        <FaTrash />
                                    </button>
                            </div>

                        ))}
                </div>
            )}

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
};

export default MyLinks;
