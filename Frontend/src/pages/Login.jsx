import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthDataContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  
  const [formData, setFormData] = useState({
    email: "intern@dacoid.com",
    password: "test123",
  });
  const [error, setError] = useState('');
  const [show , setShow] = useState(false);
  
  const {setUser } = useContext(AuthDataContext);
  let navigate = useNavigate();

    const handleChange = (e) => {
        let {name, value} = e.target;
        setFormData({...formData,[name]: value});
        console.log(formData);
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        console.log('API URL:', import.meta.env.VITE_BASE_URL);
        console.log(email,password)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`,formData ,
                { withCredentials: true });
                console.log(response)

            if(response.status === 200) {
                const data = response.data;
                console.log('Login successful:', data);
                localStorage.setItem('token',data.token); // Store user data in local storage
                setUser(data.user); // Update user context
                navigate("/dashboard"); // Redirect to home page
            }
        }
        catch (err) {
          console.error('Login error:', err);
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
      setShow(true);
    },[])

    return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] ">
              <div className={`w-full max-w-sm p-8 bg-[#1e293b] dark:bg-[#1e293b] rounded-xl shadow-2xl transform duration-300 ${show ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                  Welcome Back
                </h2>
        
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
        
                  <div className="mb-5">
                    <label className="block text-sm text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded bg-[#334155] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
        
                  {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-emerald-400 text-white font-semibold py-2 rounded transition duration-200 shadow-md"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          );
}


export default Login