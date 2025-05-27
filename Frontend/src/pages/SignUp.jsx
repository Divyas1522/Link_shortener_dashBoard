import axios from 'axios';
import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../context/AuthContext';

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { user, setUser } = useContext(AuthDataContext)

    let navigate = useNavigate();

    const handleClick = () => {
        navigate("/login")
    }


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value })
        setError(''); // Clear error on input change
        console.log(formData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        const { name, email, password } = formData;
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, formData,
                { withCredentials: true });
            console.log(response);

            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                console.log("register successfully");
                localStorage.setItem("token", data.token);
                navigate("/login");
            }
        }
        catch (err) {
            console.error('err:', err);
            if (err.response) {
                setError(err.response.data.message || 'Invalid email or password');
            } else if (err.request) {
                setError('Network error: Unable to reach the server');
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setUser(response.data.user);
                    navigate("/dashboard");
                }
            } catch (error) {
                console.log("Token verification failed", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        };

        verifyToken();

        setShow(true);
    }, [])

    return (
        <div className='h-screen w-full bg-[#0f172a] flex justify-center items-center '>
            <div className={`w-110 h-130 p-7 bg-[#1e293b] dark:bg-[#1e293b]  rounded-2xl transform ease-in duration-300 ${show ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                <h1 className='text-white text-3xl font-bold text-center mt-7' >Create Account</h1>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm text-gray-300 mt-4 mb-1">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter your name"
                        required
                        className='w-full px-3 py-2 rounded bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' />

                    <label className="block text-sm text-gray-300 mt-4 mb-1">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        required
                        placeholder="Enter your email"
                        className='w-full px-3 py-2 rounded bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' />

                    <label className="block text-sm text-gray-300 mt-4 mb-1">Password</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Create password"
                        className='w-full px-3 py-2 rounded bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' />

                    <button type='submit' className='bg-blue-600 py-2 px-7 rounded-xl ml-35 mt-10 text-white transition ease-in duration-200 hover:bg-emerald-500 '>Submit</button>

                    <div className='text-sky-400 mt-2 ml-19 underline'>Already have an account?

                        <button onClick={handleClick} className='text-white ml-1'>SignIn</button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default SignUp;