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
        const fetchData = async () => {
            try {
                const roomsRes = await axios.get("/api/rooms");
                setRooms(roomsRes.data);

                const bookingsRes = await axios.get(`/api/bookings/user/${user.id}`);
                setHistory(bookingsRes.data);
            } catch (err) {
                toast.error("Data load failed");
            } finally {
                setLoading(false);
            }
        };

        if (!user) {
            navigate('/');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/bookings/add', {
                userId: user.id,
                roomId: bookingData.roomId,
                startDate: bookingData.start,
                endDate: bookingData.end
            });

            if (res.data.success) {
                toast.success("Booking Confirmed!");
                setBookingData({ roomId: '', start: '', end: '' });

                const bookingsRes = await axios.get(`/api/bookings/user/${user.id}`);
                setHistory(bookingsRes.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Booking Failed");
        }
    };

    const calculateTotal = () => {
        if (!bookingData.roomId || !bookingData.start || !bookingData.end) return null;
        const room = rooms.find(r => r.id === Number(bookingData.roomId));
        const days = Math.ceil((new Date(bookingData.end) - new Date(bookingData.start)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return null;
        return {
            perNight: room.price_per_night,
            days: days,
            total: (days * room.price_per_night).toLocaleString()
        };
    };

    const priceDetails = calculateTotal();

    if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4">
            <nav className="max-w-7xl mx-auto bg-[#1e293b] p-4 rounded-2xl mb-8 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-500">ROOM RESERVE</h1>
                <div>
                    <span className="mr-4">Hello, {user.name}</span>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-[#1e293b] p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4">New Booking</h2>

                    <form onSubmit={handleBooking} className="space-y-4">
                        <select required className="w-full p-3 bg-[#0f172a] border rounded"
                            value={bookingData.roomId}
                            onChange={e => setBookingData({ ...bookingData, roomId: e.target.value })}>
                            <option value="">Select Room</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.name} - ₹{r.price_per_night}
                                </option>
                            ))}
                        </select>

                        <input type="date" required className="w-full p-3 bg-[#0f172a] border rounded"
                            value={bookingData.start}
                            onChange={e => setBookingData({ ...bookingData, start: e.target.value })} />

                        <input type="date" required className="w-full p-3 bg-[#0f172a] border rounded"
                            value={bookingData.end}
                            onChange={e => setBookingData({ ...bookingData, end: e.target.value })} />

                        {priceDetails && (
                            <div className="bg-blue-500/10 p-3 rounded">
                                Total: ₹{priceDetails.total}
                            </div>
                        )}

                        <button className="w-full bg-blue-600 py-3 rounded">Reserve</button>
                    </form>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-2xl">
                    <h2 className="text-lg font-bold mb-4">History</h2>

                    {history.length === 0 ? (
                        <p>No bookings</p>
                    ) : (
                        history.map(h => (
                            <div key={h.id} className="mb-3 border-b pb-2">
                                <p>{h.room_name}</p>
                                <p>
                                    {new Date(h.start_date).toLocaleDateString()} - {new Date(h.end_date).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;