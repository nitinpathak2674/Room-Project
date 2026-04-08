import React, { useState } from 'react';
import axios from 'axios';
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await axios.post('https://room-reserve-clean.onrender.com/api/auth/register', formData);
            if (res.data.success) {
                toast.success("Account created! Please login.");
                navigate('/');
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
                    <input type="text" required placeholder="Full Name" className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="email" required autoComplete="off" placeholder="Email Address" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
                    <input type="password" required autoComplete="new-password" placeholder="Password" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500" onChange={e => setFormData({...formData, password: e.target.value})} value={formData.password} />
                    <button type="submit" disabled={isSubmitting} className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-700 cursor-not-allowed opacity-70' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'}`}>
                        {isSubmitting ? <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>CREATING ACCOUNT...</> : "REGISTER NOW"}
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400 text-sm">Already a member? <span onClick={() => navigate('/')} className="text-emerald-500 cursor-pointer font-bold hover:underline">Login</span></p>
            </div>
        </div>
    );
};

export default Register;