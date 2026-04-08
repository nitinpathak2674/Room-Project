import React, { useState } from 'react';
import axios from '../axios'; // axios instance
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // axios instance will prepend baseURL automatically
            const res = await axios.post('/auth/login', formData);

            if (res.data.success) {
                // save token & user
                localStorage.setItem('token', res.data.token); 
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success("Welcome back!");
                navigate('/dashboard');
            } else {
                toast.error(res.data.message || "Login failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Login Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-800 w-full max-w-[400px] shadow-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center italic tracking-wider">ROOM RESERVE</h2>
                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                    <input 
                        type="email" 
                        required 
                        placeholder="Email Address" 
                        className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input 
                        type="password" 
                        required 
                        placeholder="Password" 
                        className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base" 
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={`w-full font-black py-4 rounded-2xl transition-all active:scale-95 text-sm sm:text-base ${
                            isSubmitting 
                            ? 'bg-slate-700 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                        }`}
                    >
                        {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400 text-xs sm:text-sm">
                    Don't have an account? 
                    <span 
                        onClick={() => navigate('/register')} 
                        className="text-blue-500 cursor-pointer font-bold hover:underline ml-1"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;