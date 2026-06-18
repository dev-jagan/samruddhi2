"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPropertyInfo, savePropertyInfo, getBookings, saveBookings, INITIAL_BOOKINGS } from '../data';
import { getAmenityIcon } from '../components';

export default function AdminPage() {
    const [property, setProperty] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    
    // Auth states
    const [adminPass, setAdminPass] = useState("");
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    
    // Sync states
    const [icalUrl, setIcalUrl] = useState("https://www.airbnb.com/calendar/ical/73918239.ics?s=f9a88e994270cb1b");
    const [lastSync, setLastSync] = useState(new Date("2026-06-16T19:30:00"));
    const [syncStatus, setSyncStatus] = useState("success");
    const [syncLogs, setSyncLogs] = useState<any[]>([
        { time: "19:30:00", type: "success", msg: "Polled Airbnb calendar endpoint successfully. 0 changes detected." },
        { time: "19:25:00", type: "success", msg: "iCal feed processed. Saved 9 reservations and 3 blocked blocks." }
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

    useEffect(() => {
        const info = getPropertyInfo();
        const bks = getBookings();
        setProperty(info);
        setBookings(bks);
        
        // Initialize form
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
    }, []);

    const showToast = (message: string, type: string = "success") => {
        setToast({ message, type } as any);
        setTimeout(() => setToast(null), 4500);
    };

    const handleAdminLogin = (e: any) => {
        e.preventDefault();
        if (adminPass === "admin123" || adminPass.toLowerCase() === "admin") {
            setIsAdminAuthenticated(true);
            showToast("Access granted to property management portal", "success");
        } else {
            showToast("Invalid password key. (Hint: enter 'admin')", "error");
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
        showToast("Properties mapped and successfully persisted to simulated PostgreSQL database!", "success");
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
            showToast("Please provide both image URL and descriptive caption text", "error");
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
        showToast("New space asset linked to the home gallery!", "success");
    };

    const handleRemoveImage = (id: number) => {
        if (property.images.length <= 1) {
            showToast("At least one hero gallery image must persist at all times.", "error");
            return;
        }
        const updated = {
            ...property,
            images: property.images.filter((img: any) => img.id !== id)
        };
        setProperty(updated);
        savePropertyInfo(updated);
        showToast("Property image detached", "info");
    };

    const triggerSync = () => {
        if (!icalUrl || !icalUrl.startsWith("http")) {
            showToast("Please provide a valid iCal URL address", "error");
            return;
        }

        setSyncStatus("syncing");
        const currentTimeStr = new Date().toLocaleTimeString();

        setSyncLogs(prev => [
            { time: currentTimeStr, type: "info", msg: `Polling Airbnb API target: ${icalUrl.substring(0, 35)}...` },
            ...prev
        ]);

        setTimeout(() => {
            const midTimeStr = new Date().toLocaleTimeString();
            setSyncLogs(prev => [
                { time: midTimeStr, type: "info", msg: "Parser reading VEVENT elements. Converting ISO sequences..." },
                { time: midTimeStr, type: "database", msg: "Open connection to PostgreSQL: updating transaction records." },
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
                    if (!newBookings.find(b => b.date === rd.date)) {
                        newBookings.push(rd);
                    }
                });

                setBookings(newBookings);
                saveBookings(newBookings);
                setSyncStatus("success");
                setLastSync(new Date());
                setSyncLogs(prev => [
                    { time: finalTimeStr, type: "success", msg: "Sync absolute success! PostgreSQL updated (Added 4 freshly acquired nights)." },
                    ...prev
                ]);
                showToast("Synchronized successfully with Airbnb!", "success");
            }, 1000);
        }, 1000);
    };

    const handleResetCalendar = () => {
        setBookings(INITIAL_BOOKINGS);
        saveBookings(INITIAL_BOOKINGS);
        showToast("Calendar sync blocks reset to pristine Airbnb seed values", "info");
    };

    if (!property) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-500">Loading Administrative Portal...</div>;

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-stone-50 py-24 px-4">
                <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-stone-200">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
                            🔒
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-stone-950">Property Admin Portal</h2>
                        <p className="text-xs text-stone-500 mt-1">Authenticate to synchronize and modify database details</p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="text-xs text-stone-600 font-bold uppercase tracking-wider block mb-1">Access Passphrase</label>
                            <input
                                type="password"
                                placeholder="Enter administrative token (Hint: enter 'admin')"
                                value={adminPass}
                                onChange={(e) => setAdminPass(e.target.value)}
                                className="w-full border border-stone-200 bg-stone-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-950"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-stone-950 hover:bg-stone-900 text-white text-xs uppercase font-bold tracking-wider py-3.5 rounded-xl shadow transition-all"
                        >
                            Unlock Management Console
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 underline">Return to Homepage</Link>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 text-[10px] text-stone-400 text-center leading-relaxed">
                        Security policy: Mock v1.0 local developer loop active. Bypass by keying in standard test credentials.
                    </div>
                </div>
            </div>
        );
    }

    const totalBooked = bookings.filter((b: any) => b.status === "booked").length;
    const totalBlocked = bookings.filter((b: any) => b.status === "blocked").length;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all border transform translate-y-0 ${toast.type === 'error'
                        ? 'bg-rose-50 border-rose-150 text-rose-800'
                        : 'bg-stone-900 border-stone-800 text-stone-50'
                    }`}>
                    <div className="text-sm font-medium">{toast.message}</div>
                    <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white font-bold ml-2">×</button>
                </div>
            )}

            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-stone-50 font-semibold tracking-tighter">O</div>
                        <div>
                            <span className="font-semibold tracking-wider uppercase text-xs block text-stone-500">Boutique Portfolio</span>
                            <span className="font-serif text-lg leading-none font-bold text-stone-950">{property.title}</span>
                        </div>
                    </Link>
                    
                    <button
                        onClick={() => setIsAdminAuthenticated(false)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                        Lock Administrative Portal
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-stone-200 mb-8">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Property Administration Area</span>
                        <h2 className="font-serif text-3xl font-bold text-stone-950">Control Console Dashboard</h2>
                        <p className="text-stone-500 text-xs mt-1">PostgreSQL v15 Direct Storage API & Airbnb Sync Controller</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Sync Engine */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                            <h3 className="font-serif text-lg font-bold text-stone-950 mb-4 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                Airbnb iCal Sync Center
                            </h3>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Booked Nights</span>
                                    <span className="text-xl font-bold text-rose-600">{totalBooked} days</span>
                                </div>
                                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                                    <span className="text-[10px] text-stone-500 uppercase font-mono block">Owner Blocked</span>
                                    <span className="text-xl font-bold text-stone-600">{totalBlocked} days</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1.5">Airbnb .ics Feed Endpoint URL</label>
                                    <textarea
                                        rows={3}
                                        value={icalUrl}
                                        onChange={(e) => setIcalUrl(e.target.value)}
                                        placeholder="https://www.airbnb.com/calendar/ical/..."
                                        className="w-full text-xs font-mono bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-950"
                                    />
                                </div>

                                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/60 text-[10px] text-rose-800 leading-relaxed">
                                    ℹ️ The Airbnb sync client is currently polling every 5 minutes automatically.
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={triggerSync}
                                        disabled={syncStatus === "syncing"}
                                        className={`flex-1 text-xs uppercase tracking-wider font-bold py-3 rounded-xl text-center text-white transition-all ${syncStatus === "syncing"
                                                ? 'bg-stone-400 cursor-not-allowed'
                                                : 'bg-stone-950 hover:bg-stone-900 shadow'
                                            }`}
                                    >
                                        {syncStatus === "syncing" ? "Parsing Airbnb stream..." : "Manual 'Sync Now'"}
                                    </button>

                                    <button
                                        onClick={handleResetCalendar}
                                        title="Reset dates to pristine seed values for testing"
                                        className="px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition text-xs font-mono"
                                    >
                                        ↻ Reset
                                    </button>
                                </div>

                                <div className="text-[10px] font-mono text-stone-500 flex flex-col gap-1 pt-2 border-t border-stone-100">
                                    <div className="flex justify-between">
                                        <span>Last Checked:</span>
                                        <strong className="text-stone-700">{lastSync.toLocaleTimeString()}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Current Date Scope:</span>
                                        <strong className="text-stone-700">June - July 2026</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-stone-950 text-stone-300 rounded-2xl p-6 border border-stone-900 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">Sync Engine Log Console</h4>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>

                            <div className="h-64 overflow-y-auto space-y-3 font-mono text-[10px] text-stone-400 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                                {syncLogs.map((log: any, index: number) => (
                                    <div key={index} className="border-b border-stone-800/80 pb-2">
                                        <div className="flex justify-between text-stone-500 mb-0.5">
                                            <span>{log.time}</span>
                                            <span className={`uppercase font-bold text-[8px] px-1 rounded ${log.type === "success"
                                                    ? 'bg-emerald-950 text-emerald-400'
                                                    : log.type === "error"
                                                        ? 'bg-rose-950 text-rose-400'
                                                        : 'bg-stone-800 text-stone-300'
                                                }`}>
                                                {log.type}
                                            </span>
                                        </div>
                                        <p className="text-stone-200 leading-relaxed">{log.msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Database Modification */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                            <h3 className="font-serif text-lg font-bold text-stone-950 mb-6 flex items-center gap-2">
                                📂 Property Copywriting & Settings DB Core
                            </h3>

                            <form onSubmit={handleSavePropertyInfo} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Property Title</label>
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-950"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Property Tagline</label>
                                        <input
                                            type="text"
                                            value={editedTagline}
                                            onChange={(e) => setEditedTagline(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-950"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Marketing Description Text</label>
                                    <textarea
                                        rows={4}
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-950 leading-relaxed"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Nightly Pricing ($)</label>
                                        <input
                                            type="number"
                                            value={editedPrice}
                                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Max Guests</label>
                                        <input
                                            type="number"
                                            value={editedCapacity}
                                            onChange={(e) => setEditedCapacity(Number(e.target.value))}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={editedLocation}
                                            onChange={(e) => setEditedLocation(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Host Name</label>
                                        <input
                                            type="text"
                                            value={editedHostName}
                                            onChange={(e) => setEditedHostName(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Host Email</label>
                                        <input
                                            type="email"
                                            value={editedHostEmail}
                                            onChange={(e) => setEditedHostEmail(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Host Phone</label>
                                        <input
                                            type="text"
                                            value={editedHostPhone}
                                            onChange={(e) => setEditedHostPhone(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-500 font-bold block mb-1">Airbnb URL</label>
                                        <input
                                            type="text"
                                            value={editedAirbnbUrl}
                                            onChange={(e) => setEditedAirbnbUrl(e.target.value)}
                                            className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl shadow transition"
                                >
                                    Apply & Save Core Copy to PostgreSQL Database
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                            <h3 className="font-serif text-lg font-bold text-stone-950 mb-4">Toggle Live Amenities Catalog</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {property.amenities.map((am: any) => (
                                    <button
                                        key={am.id}
                                        onClick={() => handleToggleAmenity(am.id)}
                                        className={`p-3 rounded-xl text-left border flex flex-col justify-between h-24 transition-all ${am.active
                                                ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                                                : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
                                            }`}
                                    >
                                        <span className="text-lg">{getAmenityIcon(am.icon)}</span>
                                        <div className="text-xs">
                                            <span className="block font-medium truncate">{am.label}</span>
                                            <span className="text-[9px] opacity-80">{am.active ? "Published" : "Hidden"}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                            <h3 className="font-serif text-lg font-bold text-stone-950 mb-4">Property Photo Assets Manager</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
                                {property.images.map((img: any) => (
                                    <div key={img.id} className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                                        <div className="flex items-center gap-3">
                                            <img src={img.url} className="w-12 h-12 object-cover rounded-md" alt="preview" />
                                            <div>
                                                <span className="font-medium text-stone-900 block truncate max-w-xs">{img.caption}</span>
                                                <span className="text-[10px] text-stone-500 truncate max-w-xs block">{img.url}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveImage(img.id)} className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1">Delete</button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <h4 className="text-xs font-bold text-stone-700 uppercase mb-3">Add Custom Image Asset</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Image URL..."
                                        value={newImgUrl}
                                        onChange={(e) => setNewImgUrl(e.target.value)}
                                        className="text-xs bg-white border border-stone-200 p-2.5 rounded-lg focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Caption..."
                                        value={newImgCaption}
                                        onChange={(e) => setNewImgCaption(e.target.value)}
                                        className="text-xs bg-white border border-stone-200 p-2.5 rounded-lg focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleAddNewImage}
                                    className="w-full sm:w-auto bg-stone-950 hover:bg-stone-900 text-white text-xs uppercase font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Insert Photograph Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
