import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [bookingData, setBookingData] = useState({ roomId: '', start: '', end: '' });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) navigate('/');
        else fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const roomsRes = await axios.get('https://room-reserve-clean.onrender.com/api/rooms');
            setRooms(roomsRes.data);
            const bookingsRes = await axios.get(`https://room-reserve-clean.onrender.com/api/bookings/user/${user.id}`);
            setHistory(bookingsRes.data);
        } catch (err) {
            toast.error("Data load failed");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://room-reserve-clean.onrender.com/api/bookings/add', {
                userId: user.id, 
                roomId: bookingData.roomId,
                startDate: bookingData.start, 
                endDate: bookingData.end
            });
            if (res.data.success) {
                toast.success("Booking Confirmed!");
                setBookingData({ roomId: '', start: '', end: '' });
                fetchData(); 
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Booking Failed");
        }
    };

    const calculateTotal = () => {
        if (!bookingData.roomId || !bookingData.start || !bookingData.end) return null;
        const room = rooms.find(r => r.id === bookingData.roomId);
        const days = Math.ceil((new Date(bookingData.end) - new Date(bookingData.start)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return null;
        return {
            perNight: room.price_per_night,
            days: days,
            total: (days * room.price_per_night).toLocaleString()
        };
    };

    const priceDetails = calculateTotal();

    if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-sans">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 sm:p-6 font-sans">
            <nav className="max-w-7xl mx-auto bg-[#1e293b] p-4 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-800 shadow-xl">
                <h1 className="text-xl sm:text-2xl font-black text-blue-500 tracking-tighter">ROOM RESERVE</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs sm:text-sm font-medium italic">Hello, {user.name}</span>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Logout</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-4 bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl h-fit">
                    <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span> New Booking
                    </h2>
                    
                    <form onSubmit={handleBooking} className="space-y-5" autoComplete="off">
                        <input type="text" style={{ display: 'none' }} autoComplete="username" />
                        <input type="password" style={{ display: 'none' }} autoComplete="new-password" />

                        <select required className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={bookingData.roomId} onChange={e => setBookingData({...bookingData, roomId: e.target.value})}>
                            <option value="">Select Room Category</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name} - ₹{r.price_per_night}</option>)}
                        </select>
                        
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Check-in</label>
                            <input type="date" required className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white text-sm outline-none" 
                                value={bookingData.start} onChange={e => setBookingData({...bookingData, start: e.target.value})} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Check-out</label>
                            <input type="date" required className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl text-white text-sm outline-none" 
                                value={bookingData.end} onChange={e => setBookingData({...bookingData, end: e.target.value})} />
                        </div>

                        {priceDetails && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-in fade-in duration-500">
                                <div className="flex justify-between text-[10px] sm:text-xs mb-2">
                                    <span className="text-slate-400">Rate/Night</span>
                                    <span className="text-white font-medium">₹{priceDetails.perNight}</span>
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-xs mb-3 pb-3 border-b border-slate-700/50">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="text-white font-medium">{priceDetails.days} Nights</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm font-black">
                                    <span className="text-blue-400">Total Price</span>
                                    <span className="text-blue-400 text-base sm:text-lg">₹{priceDetails.total}</span>
                                </div>
                            </div>
                        )}

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm sm:text-base">RESERVE NOW</button>
                    </form>
                </div>

                <div className="lg:col-span-8 bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> History
                    </h2>
                    {history.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl">
                            <p className="text-slate-500 text-sm font-medium">No reservations found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto"> 
                            <table className="min-w-full text-left border-collapse">
                                <thead className="bg-[#0f172a]">
                                    <tr>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Room</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Dates</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {history.map(h => (
                                        <tr key={h.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white text-xs sm:text-sm whitespace-nowrap">{h.room_name}</div>
                                                <div className="text-[9px] text-slate-500">ID: #{h.id}</div>
                                            </td>
                                            <td className="p-4 text-center text-[10px] sm:text-xs font-medium text-slate-400 whitespace-nowrap">
                                                {new Date(h.start_date).toLocaleDateString()} - {new Date(h.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-emerald-500/10 text-emerald-500 px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black border border-emerald-500/20 whitespace-nowrap">
                                                    CONFIRMED
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;