import React, { useState } from 'react';
import axios from '../axios'; // use axios instance
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // call backend via axios instance
            const res = await axios.post('/auth/register', formData);

            if (res.data.success) {
                // save token & user if backend returns
                if(res.data.token) localStorage.setItem('token', res.data.token);
                if(res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
                
                toast.success("Account created! Redirecting to dashboard...");
                navigate('/dashboard'); // redirect to dashboard
            } else {
                toast.error(res.data.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-6 text-center italic tracking-widest">REGISTER</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input 
                        type="text" 
                        required 
                        placeholder="Full Name" 
                        className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    />
                    <input 
                        type="email" 
                        required 
                        placeholder="Email Address" 
                        className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    />
                    <input 
                        type="password" 
                        required 
                        placeholder="Password" 
                        className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                        value={formData.password} 
                        onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                            isSubmitting ? 'bg-slate-700 cursor-not-allowed opacity-70' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                        }`}
                    >
                        {isSubmitting ? "CREATING ACCOUNT..." : "REGISTER NOW"}
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400 text-sm">
                    Already a member? 
                    <span onClick={() => navigate('/')} className="text-emerald-500 cursor-pointer font-bold hover:underline ml-1">Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;