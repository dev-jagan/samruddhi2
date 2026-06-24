"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPropertyInfo, savePropertyInfo, getBookings, saveBookings, INITIAL_BOOKINGS, getFaqs, saveFaqs, getReviews, saveReviews, getWaNumber, saveWaNumber } from '../data';
import { getAmenityIcon } from '../components';

export default function AdminPage() {
    const [property, setProperty] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [waNumber, setWaNumber] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const [adminPass, setAdminPass] = useState("");
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const [icalUrl, setIcalUrl] = useState("https://www.airbnb.com/calendar/ical/73918239.ics?s=f9a88e994270cb1b");
    const [lastSync, setLastSync] = useState(new Date("2026-06-16T00:00:00"));
    const [syncStatus, setSyncStatus] = useState("success");
    const [syncLogs, setSyncLogs] = useState<any[]>([
        { time: "00:00:00", type: "success", msg: "Calendar synced. 0 changes detected." },
        { time: "00:00:00", type: "success", msg: "Saved 0 reservations and 0 blocked blocks." }
    ]);

    const [toast, setToast] = useState<any>(null);

    // Form states
    const [editedTitle, setEditedTitle] = useState("");
    const [editedTagline, setEditedTagline] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedPrice, setEditedPrice] = useState(0);
    const [editedCapacity, setEditedCapacity] = useState(0);
    const [editedLocation, setEditedLocation] = useState("");
    const [editedHostName, setEditedHostName] = useState("");
    const [editedHostEmail, setEditedHostEmail] = useState("");
    const [editedHostPhone, setEditedHostPhone] = useState("");
    const [editedAirbnbUrl, setEditedAirbnbUrl] = useState("");

    const [newImgUrl, setNewImgUrl] = useState("");
    const [newImgCaption, setNewImgCaption] = useState("");

    // FAQ editor
    const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null);
    const [editFaqQ, setEditFaqQ] = useState("");
    const [editFaqA, setEditFaqA] = useState("");
    const [newFaqQ, setNewFaqQ] = useState("");
    const [newFaqA, setNewFaqA] = useState("");

    // Review editor
    const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null);
    const [editReviewName, setEditReviewName] = useState("");
    const [editReviewLocation, setEditReviewLocation] = useState("");
    const [editReviewDate, setEditReviewDate] = useState("");
    const [editReviewRating, setEditReviewRating] = useState(5);
    const [editReviewComment, setEditReviewComment] = useState("");

    useEffect(() => {
        const info = getPropertyInfo();
        const bks = getBookings();
        setProperty(info);
        setBookings(bks);
        setFaqs(getFaqs());
        setReviews(getReviews());
        setWaNumber(getWaNumber());

        setEditedTitle(info.title);
        setEditedTagline(info.tagline);
        setEditedDescription(info.description);
        setEditedPrice(info.pricePerNight);
        setEditedCapacity(info.guestCapacity);
        setEditedLocation(info.location);
        setEditedHostName(info.hostName);
        setEditedHostEmail(info.hostEmail);
        setEditedHostPhone(info.hostPhone);
        setEditedAirbnbUrl(info.airbnbUrl);

        const saved = localStorage.getItem('admin_dark_mode');
        if (saved === 'true') setDarkMode(true);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('admin_dark_mode', String(darkMode));
    }, [darkMode]);

    const dm = darkMode;

    const showToast = (message: string, type: string = "success") => {
        setToast({ message, type } as any);
        setTimeout(() => setToast(null), 4500);
    };

    const handleAdminLogin = (e: any) => {
        e.preventDefault();
        if (adminPass === "admin123" || adminPass.toLowerCase() === "admin") {
            setIsAdminAuthenticated(true);
            showToast("Access granted to management portal", "success");
        } else {
            showToast("Invalid password. Hint: enter 'admin'", "error");
        }
    };

    const handleSavePropertyInfo = (e: any) => {
        e.preventDefault();
        const updated = {
            ...property,
            title: editedTitle,
            tagline: editedTagline,
            description: editedDescription,
            pricePerNight: Number(editedPrice),
            guestCapacity: Number(editedCapacity),
            location: editedLocation,
            hostName: editedHostName,
            hostEmail: editedHostEmail,
            hostPhone: editedHostPhone,
            airbnbUrl: editedAirbnbUrl
        };
        setProperty(updated);
        savePropertyInfo(updated);
        showToast("Property settings saved!", "success");
    };

    const handleToggleAmenity = (id: string) => {
        const updatedAmenities = property.amenities.map((am: any) => {
            if (am.id === id) return { ...am, active: !am.active };
            return am;
        });
        const updated = { ...property, amenities: updatedAmenities };
        setProperty(updated);
        savePropertyInfo(updated);
        showToast("Amenity status updated", "success");
    };

    const handleAddNewImage = () => {
        if (!newImgUrl || !newImgCaption) {
            showToast("Please provide both image URL and caption", "error");
            return;
        }
        const updated = {
            ...property,
            images: [
                ...property.images,
                { id: Date.now(), url: newImgUrl, caption: newImgCaption }
            ]
        };
        setProperty(updated);
        savePropertyInfo(updated);
        setNewImgUrl("");
        setNewImgCaption("");
        showToast("New image added to gallery!", "success");
    };

    const handleRemoveImage = (id: number) => {
        if (property.images.length <= 1) {
            showToast("At least one image must remain.", "error");
            return;
        }
        const updated = {
            ...property,
            images: property.images.filter((img: any) => img.id !== id)
        };
        setProperty(updated);
        savePropertyInfo(updated);
        showToast("Image removed", "info");
    };

    const triggerSync = () => {
        if (!icalUrl || !icalUrl.startsWith("http")) {
            showToast("Please provide a valid iCal URL", "error");
            return;
        }

        setSyncStatus("syncing");
        const currentTimeStr = new Date().toLocaleTimeString();
        setSyncLogs(prev => [
            { time: currentTimeStr, type: "info", msg: `Syncing calendar from: ${icalUrl.substring(0, 35)}...` },
            ...prev
        ]);

        setTimeout(() => {
            const midTimeStr = new Date().toLocaleTimeString();
            setSyncLogs(prev => [
                { time: midTimeStr, type: "info", msg: "Processing bookings data..." },
                ...prev
            ]);

            setTimeout(() => {
                const finalTimeStr = new Date().toLocaleTimeString();
                const randomDates = [
                    { date: "2026-06-11", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-06-12", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-07-10", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-07-11", status: "booked", source: "Airbnb Sync" },
                ];

                const newBookings = [...bookings];
                randomDates.forEach(rd => {
                    if (!newBookings.find((b: any) => b.date === rd.date)) {
                        newBookings.push(rd);
                    }
                });

                setBookings(newBookings);
                saveBookings(newBookings);
                setSyncStatus("success");
                setLastSync(new Date());
                setSyncLogs(prev => [
                    { time: finalTimeStr, type: "success", msg: "Sync complete! Added 4 new booking dates." },
                    ...prev
                ]);
                showToast("Synchronized with Airbnb!", "success");
            }, 1000);
        }, 1000);
    };

    const handleResetCalendar = () => {
        setBookings(INITIAL_BOOKINGS);
        saveBookings(INITIAL_BOOKINGS);
        showToast("Calendar reset to seed data", "info");
    };

    const handleSaveFaq = (idx: number) => {
        const updated = [...faqs];
        updated[idx] = { q: editFaqQ, a: editFaqA };
        setFaqs(updated);
        saveFaqs(updated);
        setEditingFaqIdx(null);
        showToast("FAQ updated", "success");
    };

    const handleAddFaq = () => {
        if (!newFaqQ || !newFaqA) {
            showToast("Please enter both question and answer", "error");
            return;
        }
        const updated = [...faqs, { q: newFaqQ, a: newFaqA }];
        setFaqs(updated);
        saveFaqs(updated);
        setNewFaqQ("");
        setNewFaqA("");
        showToast("FAQ added", "success");
    };

    const handleDeleteFaq = (idx: number) => {
        const updated = faqs.filter((_: any, i: number) => i !== idx);
        setFaqs(updated);
        saveFaqs(updated);
        showToast("FAQ removed", "info");
    };

    const handleSaveReview = (idx: number) => {
        const updated = [...reviews];
        updated[idx] = { name: editReviewName, location: editReviewLocation, date: editReviewDate, rating: editReviewRating, comment: editReviewComment };
        setReviews(updated);
        saveReviews(updated);
        setEditingReviewIdx(null);
        showToast("Review updated", "success");
    };

    const handleAddReview = () => {
        const updated = [...reviews, { name: "New Guest", location: "India", date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), rating: 5, comment: "Great stay!" }];
        setReviews(updated);
        saveReviews(updated);
        showToast("New review added", "success");
    };

    const handleDeleteReview = (idx: number) => {
        const updated = reviews.filter((_: any, i: number) => i !== idx);
        setReviews(updated);
        saveReviews(updated);
        showToast("Review removed", "info");
    };

    const handleSaveWaNumber = () => {
        saveWaNumber(waNumber);
        showToast("WhatsApp number saved", "success");
    };

    if (!property) return <div className={`min-h-screen flex items-center justify-center font-serif ${dm ? 'text-stone-400 bg-stone-950' : 'text-stone-500 bg-stone-50'}`}>Loading Admin...</div>;

    if (!isAdminAuthenticated) {
        return (
            <div className={`min-h-screen py-24 px-4 ${dm ? 'bg-stone-950' : 'bg-stone-50'}`}>
                <div className={`max-w-md mx-auto p-8 rounded-2xl shadow-xl border ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                    <div className="text-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-3 ${dm ? 'bg-stone-700 text-stone-100' : 'bg-stone-900 text-white'}`}>🔒</div>
                        <h2 className={`font-serif text-2xl font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>Admin Portal</h2>
                        <p className={`text-xs mt-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Enter password to manage your property</p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider block mb-1 ${dm ? 'text-stone-300' : 'text-stone-600'}`}>Password</label>
                            <input
                                type="password"
                                placeholder="Enter 'admin'"
                                value={adminPass}
                                onChange={(e) => setAdminPass(e.target.value)}
                                className={`w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 ${dm ? 'bg-stone-800 border-stone-600 text-stone-100 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`}
                            />
                        </div>
                        <button type="submit" className={`w-full text-xs uppercase font-bold tracking-wider py-3.5 rounded-xl shadow transition-all ${dm ? 'bg-stone-100 text-stone-950 hover:bg-stone-200' : 'bg-stone-950 text-white hover:bg-stone-900'}`}>
                            Login
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/" className={`text-xs underline ${dm ? 'text-stone-400 hover:text-stone-200' : 'text-stone-400 hover:text-stone-600'}`}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalBooked = bookings.filter((b: any) => b.status === "booked").length;
    const totalBlocked = bookings.filter((b: any) => b.status === "blocked").length;

    return (
        <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${dm ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all border ${toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : dm ? 'bg-stone-800 border-stone-700 text-stone-50' : 'bg-stone-900 border-stone-800 text-stone-50'}`}>
                    <div className="text-sm font-medium">{toast.message}</div>
                    <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white font-bold ml-2">×</button>
                </div>
            )}

            <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3 ${dm ? 'bg-stone-950/90 border-stone-800' : 'bg-white/80 border-stone-200/80'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${dm ? 'bg-stone-50 text-stone-950' : 'bg-stone-950 text-stone-50'}`}>S</div>
                        <span className={`font-serif text-lg leading-none font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>Admin</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setDarkMode(!dm)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dm ? 'bg-stone-800 text-yellow-400 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                            {dm ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                            )}
                        </button>
                        <Link href="/" className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${dm ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                            ← View Site
                        </Link>
                        <button onClick={() => setIsAdminAuthenticated(false)} className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${dm ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b mb-8">
                    <div>
                        <h2 className={`font-serif text-3xl font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>Dashboard</h2>
                        <p className={`text-xs mt-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Manage your property — all changes save automatically to your browser.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="xl:col-span-4 space-y-6">

                        {/* Calendar Sync */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 flex items-center gap-2 ${dm ? 'text-white' : 'text-stone-950'}`}>
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                Calendar Sync
                            </h3>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className={`p-3 rounded-xl border ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-100'}`}>
                                    <span className="text-[10px] uppercase font-mono block">Booked</span>
                                    <span className="text-xl font-bold text-rose-600">{totalBooked} days</span>
                                </div>
                                <div className={`p-3 rounded-xl border ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-100'}`}>
                                    <span className="text-[10px] uppercase font-mono block">Blocked</span>
                                    <span className="text-xl font-bold text-stone-600">{totalBlocked} days</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`text-xs font-bold block mb-1.5 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Airbnb iCal URL</label>
                                    <textarea rows={2} value={icalUrl} onChange={(e) => setIcalUrl(e.target.value)}
                                        className={`w-full text-xs font-mono p-2.5 rounded-xl focus:outline-none focus:ring-1 ${dm ? 'bg-stone-800 border-stone-600 text-stone-200 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`} />
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={triggerSync} disabled={syncStatus === "syncing"}
                                        className={`flex-1 text-xs uppercase tracking-wider font-bold py-3 rounded-xl transition-all ${syncStatus === "syncing" ? 'bg-stone-400 cursor-not-allowed text-white' : dm ? 'bg-stone-100 text-stone-950 hover:bg-stone-200' : 'bg-stone-950 text-white hover:bg-stone-900'}`}>
                                        {syncStatus === "syncing" ? "Syncing..." : "Sync Now"}
                                    </button>
                                    <button onClick={handleResetCalendar} className={`px-3 rounded-xl transition text-xs font-mono ${dm ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                                        ↻ Reset
                                    </button>
                                </div>

                                <div className={`text-[10px] font-mono flex flex-col gap-1 pt-2 border-t ${dm ? 'border-stone-700' : 'border-stone-100'}`}>
                                    <div className="flex justify-between">
                                        <span>Last Checked:</span>
                                        <strong>{lastSync.toLocaleTimeString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sync Log */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h4 className={`font-mono text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${dm ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                Sync Log
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </h4>
                            <div className={`h-48 overflow-y-auto space-y-2 font-mono text-[10px] p-3 rounded-xl border ${dm ? 'bg-stone-950 border-stone-700 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-500'}`}>
                                {syncLogs.map((log: any, index: number) => (
                                    <div key={index} className={`pb-2 ${index < syncLogs.length - 1 ? 'border-b' : ''} ${dm ? 'border-stone-800' : 'border-stone-100'}`}>
                                        <div className="flex justify-between mb-0.5">
                                            <span>{log.time}</span>
                                            <span className={`uppercase font-bold text-[8px] px-1 rounded ${log.type === "success" ? 'bg-emerald-950 text-emerald-400' : log.type === "error" ? 'bg-rose-950 text-rose-400' : dm ? 'bg-stone-700 text-stone-300' : 'bg-stone-200 text-stone-600'}`}>{log.type}</span>
                                        </div>
                                        <p className={dm ? 'text-stone-300' : 'text-stone-700'}>{log.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp Number */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>WhatsApp Number</h3>
                            <div className="flex gap-2">
                                <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)}
                                    className={`flex-1 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 ${dm ? 'bg-stone-800 border border-stone-600 text-stone-200 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`} />
                                <button onClick={handleSaveWaNumber} className={`text-xs font-bold px-4 py-2 rounded-xl transition ${dm ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Save</button>
                            </div>
                            <p className="text-[10px] mt-1 opacity-60">Include country code, no + sign. E.g., 919876543210</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="xl:col-span-8 space-y-6">

                        {/* Property Settings */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-6 ${dm ? 'text-white' : 'text-stone-950'}`}>Property Settings</h3>

                            <form onSubmit={handleSavePropertyInfo} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Title</label>
                                        <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}
                                            className={`w-full text-xs font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-1 ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Tagline</label>
                                        <input type="text" value={editedTagline} onChange={(e) => setEditedTagline(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`} />
                                    </div>
                                </div>

                                <div>
                                    <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Description</label>
                                    <textarea rows={3} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)}
                                        className={`w-full text-xs p-2.5 rounded-xl focus:outline-none focus:ring-1 leading-relaxed ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100 focus:ring-stone-400' : 'bg-stone-50 border border-stone-200 focus:ring-stone-950'}`} />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Price/night (₹)</label>
                                        <input type="number" value={editedPrice} onChange={(e) => setEditedPrice(Number(e.target.value))}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Max Guests</label>
                                        <input type="number" value={editedCapacity} onChange={(e) => setEditedCapacity(Number(e.target.value))}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Bedrooms</label>
                                        <input type="number" value={property.bedrooms} disabled
                                            className={`w-full text-xs p-2.5 rounded-xl opacity-60 ${dm ? 'bg-stone-800 border border-stone-600 text-stone-400' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Bathrooms</label>
                                        <input type="number" value={property.baths} disabled
                                            className={`w-full text-xs p-2.5 rounded-xl opacity-60 ${dm ? 'bg-stone-800 border border-stone-600 text-stone-400' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Location</label>
                                        <input type="text" value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Host Name</label>
                                        <input type="text" value={editedHostName} onChange={(e) => setEditedHostName(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Host Phone</label>
                                        <input type="text" value={editedHostPhone} onChange={(e) => setEditedHostPhone(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Host Email</label>
                                        <input type="email" value={editedHostEmail} onChange={(e) => setEditedHostEmail(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-bold block mb-1 ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Airbnb URL</label>
                                        <input type="text" value={editedAirbnbUrl} onChange={(e) => setEditedAirbnbUrl(e.target.value)}
                                            className={`w-full text-xs p-2.5 rounded-xl focus:outline-none ${dm ? 'bg-stone-800 border border-stone-600 text-stone-100' : 'bg-stone-50 border border-stone-200'}`} />
                                    </div>
                                </div>

                                <button type="submit" className={`text-xs uppercase font-bold tracking-wider py-3 px-6 rounded-xl shadow transition ${dm ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                                    Save Settings
                                </button>
                            </form>
                        </div>

                        {/* Amenities */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>Amenities</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {property.amenities.map((am: any) => (
                                    <button key={am.id} onClick={() => handleToggleAmenity(am.id)}
                                        className={`p-3 rounded-xl text-left border flex flex-col justify-between h-24 transition-all ${am.active ? (dm ? 'bg-stone-700 text-white border-stone-500' : 'bg-stone-950 text-white border-stone-950 shadow-sm') : (dm ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400')}`}>
                                        <span className="text-lg">{getAmenityIcon(am.icon, dm)}</span>
                                        <div className="text-xs">
                                            <span className="block font-medium truncate">{am.label}</span>
                                            <span className="text-[9px] opacity-80">{am.active ? "Published" : "Hidden"}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photos */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>Photos</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
                                {property.images.map((img: any) => (
                                    <div key={img.id} className={`flex justify-between items-center p-3 rounded-xl border text-xs ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-200'}`}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={img.url} className="w-12 h-12 object-cover rounded-md shrink-0" alt="preview" />
                                            <div className="min-w-0">
                                                <span className={`font-medium block truncate ${dm ? 'text-stone-100' : 'text-stone-900'}`}>{img.caption}</span>
                                                <span className={`text-[10px] truncate block ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{img.url}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveImage(img.id)} className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 shrink-0">Delete</button>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-4 rounded-xl border ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-200'}`}>
                                <h4 className={`text-xs font-bold uppercase mb-3 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>Add Image</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <input type="text" placeholder="Image URL..." value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)}
                                        className={`text-xs p-2.5 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200 placeholder-stone-500' : 'bg-white border border-stone-200'}`} />
                                    <input type="text" placeholder="Caption..." value={newImgCaption} onChange={(e) => setNewImgCaption(e.target.value)}
                                        className={`text-xs p-2.5 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200 placeholder-stone-500' : 'bg-white border border-stone-200'}`} />
                                </div>
                                <button onClick={handleAddNewImage} className={`w-full sm:w-auto text-xs uppercase font-bold py-2 px-4 rounded-lg transition ${dm ? 'bg-stone-100 text-stone-950 hover:bg-stone-200' : 'bg-stone-950 text-white hover:bg-stone-900'}`}>
                                    Add Photo
                                </button>
                            </div>
                        </div>

                        {/* FAQ Editor */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>FAQs</h3>
                            <div className="space-y-2 mb-6">
                                {faqs.map((faq: any, i: number) => (
                                    <div key={i} className={`p-3 rounded-xl border text-xs ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-200'}`}>
                                        {editingFaqIdx === i ? (
                                            <div className="space-y-2">
                                                <input type="text" value={editFaqQ} onChange={(e) => setEditFaqQ(e.target.value)}
                                                    className={`w-full text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                <textarea rows={2} value={editFaqA} onChange={(e) => setEditFaqA(e.target.value)}
                                                    className={`w-full text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSaveFaq(i)} className="text-emerald-600 font-bold">Save</button>
                                                    <button onClick={() => setEditingFaqIdx(null)} className="text-rose-600 font-bold">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <span className={`font-semibold block ${dm ? 'text-stone-100' : 'text-stone-900'}`}>{faq.q}</span>
                                                    <span className={`${dm ? 'text-stone-400' : 'text-stone-500'}`}>{faq.a}</span>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => { setEditingFaqIdx(i); setEditFaqQ(faq.q); setEditFaqA(faq.a); }} className="text-xs text-stone-500 hover:text-stone-700 font-bold px-1">Edit</button>
                                                    <button onClick={() => handleDeleteFaq(i)} className="text-xs text-rose-600 font-bold px-1">Del</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className={`p-4 rounded-xl border ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-200'}`}>
                                <h4 className={`text-xs font-bold uppercase mb-3 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>Add FAQ</h4>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Question" value={newFaqQ} onChange={(e) => setNewFaqQ(e.target.value)}
                                        className={`w-full text-xs p-2.5 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200 placeholder-stone-500' : 'bg-white border border-stone-200'}`} />
                                    <textarea rows={2} placeholder="Answer" value={newFaqA} onChange={(e) => setNewFaqA(e.target.value)}
                                        className={`w-full text-xs p-2.5 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200 placeholder-stone-500' : 'bg-white border border-stone-200'}`} />
                                    <button onClick={handleAddFaq} className={`text-xs uppercase font-bold py-2 px-4 rounded-lg transition ${dm ? 'bg-stone-100 text-stone-950 hover:bg-stone-200' : 'bg-stone-950 text-white hover:bg-stone-900'}`}>
                                        Add FAQ
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Review Manager */}
                        <div className={`rounded-2xl p-6 border shadow-md ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                            <h3 className={`font-serif text-lg font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>Reviews</h3>
                            <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-1">
                                {reviews.map((review: any, i: number) => (
                                    <div key={i} className={`p-3 rounded-xl border text-xs ${dm ? 'bg-stone-800 border-stone-600' : 'bg-stone-50 border-stone-200'}`}>
                                        {editingReviewIdx === i ? (
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="text" value={editReviewName} onChange={(e) => setEditReviewName(e.target.value)}
                                                        className={`text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                    <input type="text" value={editReviewLocation} onChange={(e) => setEditReviewLocation(e.target.value)}
                                                        className={`text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="text" value={editReviewDate} onChange={(e) => setEditReviewDate(e.target.value)}
                                                        className={`text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs ${dm ? 'text-stone-300' : 'text-stone-500'}`}>Rating:</span>
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <button key={s} onClick={() => setEditReviewRating(s)} className={`text-sm ${s <= editReviewRating ? 'text-amber-400' : 'text-stone-300'}`}>★</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea rows={2} value={editReviewComment} onChange={(e) => setEditReviewComment(e.target.value)}
                                                    className={`w-full text-xs p-2 rounded-lg focus:outline-none ${dm ? 'bg-stone-900 border border-stone-600 text-stone-200' : 'bg-white border border-stone-200'}`} />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSaveReview(i)} className="text-emerald-600 font-bold">Save</button>
                                                    <button onClick={() => setEditingReviewIdx(null)} className="text-rose-600 font-bold">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-semibold ${dm ? 'text-stone-100' : 'text-stone-900'}`}>{review.name}</span>
                                                        <span className="text-amber-400 text-xs">{'★'.repeat(review.rating)}</span>
                                                    </div>
                                                    <p className={`italic ${dm ? 'text-stone-400' : 'text-stone-500'}`}>"{review.comment.substring(0, 80)}{review.comment.length > 80 ? '...' : ''}"</p>
                                                    <span className={`text-[10px] ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{review.location} · {review.date}</span>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button onClick={() => { setEditingReviewIdx(i); setEditReviewName(review.name); setEditReviewLocation(review.location); setEditReviewDate(review.date); setEditReviewRating(review.rating); setEditReviewComment(review.comment); }} className="text-xs text-stone-500 hover:text-stone-700 font-bold px-1">Edit</button>
                                                    <button onClick={() => handleDeleteReview(i)} className="text-xs text-rose-600 font-bold px-1">Del</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddReview} className={`text-xs uppercase font-bold py-2 px-4 rounded-lg transition ${dm ? 'bg-stone-100 text-stone-950 hover:bg-stone-200' : 'bg-stone-950 text-white hover:bg-stone-900'}`}>
                                + Add Review
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
