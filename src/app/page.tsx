"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPropertyInfo, getBookings, REVIEWS } from './data';
import { CalendarGrid, getAmenityIcon } from './components';

export default function Home() {
    const [property, setProperty] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 5, 1));
    const [toast, setToast] = useState<any>(null);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guestsCount, setGuestsCount] = useState(2);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setProperty(getPropertyInfo());
        setBookings(getBookings());
        // Restore saved preference
        const saved = localStorage.getItem('samruddhi_dark_mode');
        if (saved === 'true') setDarkMode(true);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('samruddhi_dark_mode', String(darkMode));
    }, [darkMode]);

    const showToast = (message: string, type: string = "success") => {
        setToast({ message, type } as any);
        setTimeout(() => setToast(null), 4500);
    };

    if (!property) return (
        <div className={`min-h-screen flex items-center justify-center font-serif text-stone-500 ${darkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
            Loading Samruddhi Experience...
        </div>
    );

    const dm = darkMode;

    return (
        <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${dm ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'}`}>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${
                    toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-stone-900 border-stone-800 text-stone-50'
                }`}>
                    <div className="text-sm font-medium">{toast.message}</div>
                    <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white font-bold ml-2">×</button>
                </div>
            )}

            {/* WhatsApp Floating Button */}
            <a
                href={`https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20booking%20Samruddhi.%20Could%20you%20please%20share%20availability%20and%20details%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 group"
                title="Chat on WhatsApp"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm font-semibold hidden sm:inline">WhatsApp Us</span>
            </a>

            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3 transition-colors duration-300 ${dm ? 'bg-stone-950/90 border-stone-800' : 'bg-white/80 border-stone-200/80'}`}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                    <Link href="/" className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold tracking-tighter ${dm ? 'bg-stone-50 text-stone-950' : 'bg-stone-950 text-stone-50'}`}>S</div>
                        <div>
                            <span className={`font-semibold tracking-wider uppercase text-xs block ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Boutique Stay · Mangaluru</span>
                            <span className={`font-serif text-lg leading-none font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>{property.title}</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Live Status */}
                        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${dm ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className={`font-semibold uppercase ${dm ? 'text-emerald-400' : 'text-stone-800'}`}>Live Synced</span>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!dm)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dm ? 'bg-stone-800 text-yellow-400 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                            title={dm ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {dm ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                                </svg>
                            )}
                        </button>

                        {/* Nav */}
                        <div className={`flex items-center gap-1 p-1 rounded-xl ${dm ? 'bg-stone-800' : 'bg-stone-100'}`}>
                            <Link href="/" className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all ${dm ? 'bg-stone-700 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm'}`}>
                                Home
                            </Link>
                            <Link href="/admin" className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5 transition-all ${dm ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <GuestHomepageView
                    property={property}
                    bookings={bookings}
                    currentCalDate={currentCalDate}
                    setCurrentCalDate={setCurrentCalDate}
                    checkInDate={checkInDate}
                    setCheckInDate={setCheckInDate}
                    checkOutDate={checkOutDate}
                    setCheckOutDate={setCheckOutDate}
                    guestsCount={guestsCount}
                    setGuestsCount={setGuestsCount}
                    showToast={showToast}
                    darkMode={dm}
                />
            </main>

            <footer className={`py-16 px-4 border-t transition-colors duration-300 ${dm ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-900 text-stone-300 border-stone-800'}`}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-stone-50 text-stone-950 flex items-center justify-center font-bold">S</div>
                            <span className="font-serif text-lg font-bold text-white tracking-wide">{property.title}</span>
                        </div>
                        <p className="text-stone-400 text-sm leading-relaxed mb-4">
                            A beautifully furnished private home in Mangaluru with modern amenities, peaceful surroundings, and seamless Airbnb-synced availability.
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-stone-400 font-mono">Real-time Airbnb iCal Sync Active</span>
                        </div>
                        <a
                            href={`https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20booking%20Samruddhi!`}
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp Enquiry
                        </a>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">The Property & Host</h4>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li>📍 {property.location}</li>
                            <li>👥 Up to {property.guestCapacity} guests</li>
                            <li>🛏 {property.bedrooms} Bedrooms · {property.beds} Beds</li>
                            <li>📞 {property.hostPhone}</li>
                            <li>✉️ {property.hostEmail}</li>
                            <li>🏆 Host: {property.hostName} (Superhost)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">Book Your Stay</h4>
                        <p className="text-stone-400 text-sm leading-relaxed mb-4">
                            Reserve securely on Airbnb or reach us directly on WhatsApp for queries, early check-in, or group bookings.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href={property.airbnbUrl} target="_blank" className="inline-block bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-rose-500 transition-all text-center">
                                🏠 View & Book on Airbnb
                            </Link>
                            <a href={`https://wa.me/919876543210?text=Hi%20Mohan%2C%20I%27d%20like%20to%20enquire%20about%20Samruddhi.`} target="_blank" className="inline-block bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all text-center">
                                💬 WhatsApp for Enquiry
                            </a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
                    <p>© 2026 {property.title} · Landlinks Layout, Ashok Nagar, Mangaluru</p>
                    <span className="text-emerald-500 mt-2 sm:mt-0">● Airbnb Synced · Always Available</span>
                </div>
            </footer>
        </div>
    );
}

// ==========================================
// --- GUEST VIEW ---
// ==========================================
function GuestHomepageView({
    property, bookings, currentCalDate, setCurrentCalDate,
    checkInDate, setCheckInDate, checkOutDate, setCheckOutDate,
    guestsCount, setGuestsCount, showToast, darkMode: dm
}: any) {
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [reviewPage, setReviewPage] = useState(0);
    const REVIEWS_PER_PAGE = 3;
    const totalPages = Math.ceil(REVIEWS.length / REVIEWS_PER_PAGE);
    const visibleReviews = REVIEWS.slice(reviewPage * REVIEWS_PER_PAGE, (reviewPage + 1) * REVIEWS_PER_PAGE);

    const handleRedirectToAirbnb = (e: any) => {
        e.preventDefault();
        if (!checkInDate || !checkOutDate) {
            showToast("Select your check-in and check-out dates first, then we'll forward you to Airbnb.", "info");
            return;
        }
        const url = `${property.airbnbUrl}?checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guestsCount}`;
        showToast("Opening Airbnb with your selected dates...", "success");
        setTimeout(() => window.open(url, "_blank"), 1200);
    };

    return (
        <div className="animate-fadeIn pb-24">

            {/* HERO */}
            <section className="relative h-[85vh] bg-stone-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={property.images[activeImageIdx]?.url || property.images[0]?.url}
                        alt={property.images[0]?.caption}
                        className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-1000 transform hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/35 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-12 md:pb-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div className="max-w-3xl">
                            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                ★ 5.0 Rating · 12+ Verified Guest Reviews · Superhost
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-none tracking-tight mb-4">
                                {property.title}
                            </h1>
                            <p className="text-stone-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                {property.tagline}
                            </p>
                            <div className="flex gap-3 mt-6">
                                <a
                                    href={`https://wa.me/919876543210?text=Hi%20Mohan%2C%20I%27m%20interested%20in%20booking%20Samruddhi!`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    WhatsApp Enquiry
                                </a>
                                <Link href={property.airbnbUrl} target="_blank" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                                    View on Airbnb →
                                </Link>
                            </div>
                        </div>

                        {/* Booking Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-stone-200 w-full md:w-96 text-stone-900">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-xs text-stone-500 uppercase block tracking-wider">Starting from</span>
                                    <span className="text-2xl font-serif font-bold text-stone-950">₹{property.pricePerNight}</span>
                                    <span className="text-stone-500 text-xs font-normal"> / night</span>
                                </div>
                                <div className="bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded">
                                    Instant Sync
                                </div>
                            </div>

                            <form onSubmit={handleRedirectToAirbnb} className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="border border-stone-200 rounded-lg p-2 bg-stone-50">
                                        <label className="text-[10px] text-stone-500 uppercase font-semibold block">Check-in</label>
                                        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full bg-transparent text-xs text-stone-800 font-medium focus:outline-none"/>
                                    </div>
                                    <div className="border border-stone-200 rounded-lg p-2 bg-stone-50">
                                        <label className="text-[10px] text-stone-500 uppercase font-semibold block">Check-out</label>
                                        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full bg-transparent text-xs text-stone-800 font-medium focus:outline-none"/>
                                    </div>
                                </div>
                                <div className="border border-stone-200 rounded-lg p-2 bg-stone-50">
                                    <label className="text-[10px] text-stone-500 uppercase font-semibold block">Guests</label>
                                    <select value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))} className="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none">
                                        {[...Array(property.guestCapacity)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                    Reserve on Airbnb
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                                <a
                                    href={`https://wa.me/919876543210?text=Hi%20Mohan%2C%20I%27m%20interested%20in%20booking%20Samruddhi%20from%20${checkInDate || 'TBD'}%20to%20${checkOutDate || 'TBD'}%20for%20${guestsCount}%20guest(s).`}
                                    target="_blank"
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-xs tracking-wider uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Enquire on WhatsApp
                                </a>
                            </form>
                            <div className="text-center mt-3 text-[10px] text-stone-500 font-medium">
                                🔒 Synced calendar prevents double bookings.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SPECS BAR */}
            <section className={`border-b py-6 px-4 transition-colors duration-300 ${dm ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-6">
                    {[
                        { icon: "👥", label: "Guest Capacity", value: `${property.guestCapacity} Adults Max`},
                        { icon: "🛏", label: "Bedrooms & Beds", value: `${property.bedrooms} Bedrooms · ${property.beds} Beds`},
                        { icon: "🚿", label: "Bathrooms", value: `${property.baths} Bathrooms`},
                        { icon: "🏆", label: "Host Rating", value: "Superhost · 4.9★"},
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <span className={`text-[10px] uppercase font-mono block ${dm ? 'text-stone-400' : 'text-stone-400'}`}>{s.label}</span>
                                <span className={`text-sm font-semibold ${dm ? 'text-stone-100' : 'text-stone-900'}`}>{s.value}</span>
                            </div>
                            {i < 3 && <div className={`h-8 w-[1px] hidden md:block ml-3 ${dm ? 'bg-stone-700' : 'bg-stone-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-14">

                    {/* About */}
                    <div>
                        <h2 className={`font-serif text-3xl font-bold mb-6 ${dm ? 'text-white' : 'text-stone-950'}`}>About this Sanctuary</h2>
                        <p className={`leading-relaxed text-lg font-light whitespace-pre-line ${dm ? 'text-stone-300' : 'text-stone-700'}`}>
                            {property.description}
                        </p>
                    </div>

                    {/* Gallery */}
                    <div>
                        <h2 className={`font-serif text-2xl font-bold mb-4 ${dm ? 'text-white' : 'text-stone-950'}`}>The Experience in Frame</h2>
                        <div className={`relative h-[450px] rounded-2xl overflow-hidden mb-4 border group ${dm ? 'bg-stone-800 border-stone-700' : 'bg-stone-100 border-stone-200'}`}>
                            <img
                                src={property.images[activeImageIdx]?.url}
                                alt={property.images[activeImageIdx]?.caption}
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-300">Space Capture</span>
                                    <p className="text-white font-medium text-lg">{property.images[activeImageIdx]?.caption}</p>
                                </div>
                                <span className="text-stone-300 font-mono text-sm">{activeImageIdx + 1} / {property.images.length}</span>
                            </div>
                            <button onClick={() => setActiveImageIdx(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow">←</button>
                            <button onClick={() => setActiveImageIdx(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow">→</button>
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                            {property.images.map((img: any, idx: number) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIdx ? 'border-stone-950 ring-2 ring-stone-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt="thumbnail"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className={`font-serif text-2xl font-bold mb-6 ${dm ? 'text-white' : 'text-stone-950'}`}>Designed for Sophistication</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.amenities.filter((a: any) => a.active).map((amenity: any) => (
                                <div key={amenity.id} className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200/60'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${dm ? 'bg-stone-700' : 'bg-stone-100'}`}>
                                        {getAmenityIcon(amenity.icon)}
                                    </div>
                                    <div>
                                        <span className={`text-sm font-semibold block ${dm ? 'text-stone-100' : 'text-stone-900'}`}>{amenity.label}</span>
                                        <span className="text-[10px] text-emerald-500 font-medium">Included</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map */}
                    <div>
                        <h2 className={`font-serif text-2xl font-bold mb-6 ${dm ? 'text-white' : 'text-stone-950'}`}>Location & Surroundings</h2>
                        <div className={`w-full h-[400px] rounded-3xl overflow-hidden border shadow-lg ${dm ? 'border-stone-700' : 'border-stone-200'}`}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.280173822452!2d74.8488346!3d12.8896593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a39626359f1%3A0xe53046f17e250170!2sLandlinks%20Layout%2C%20Ashok%20Nagar%2C%20Mangaluru%2C%20Karnataka%20575006!5e0!3m2!1sen!2sin!4v1718700000000!5m2!1sen!2sin"
                                width="100%" height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <p className={`mt-4 text-xs font-medium flex items-center gap-2 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {property.location}
                        </p>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div id="calendar-sec" className="lg:col-span-4 space-y-8">
                    <div className={`rounded-3xl p-6 shadow-xl border ${dm ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-200'}`}>
                        <div className="flex flex-col mb-4">
                            <span className={`text-[10px] uppercase font-mono tracking-widest ${dm ? 'text-stone-400' : 'text-stone-400'}`}>Availability Matrix</span>
                            <h3 className={`font-serif text-xl font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>Airbnb Sync Calendar</h3>
                        </div>

                        <div className={`grid grid-cols-3 gap-2 py-3 rounded-xl px-2 mb-4 text-[10px] font-mono border ${dm ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-100'}`}>
                            {[['bg-emerald-500', 'Available'],['bg-rose-500','Booked'],['bg-stone-400','Blocked']].map(([col, label]) => (
                                <div key={label} className="flex items-center justify-center gap-1.5">
                                    <span className={`w-2.5 h-2.5 rounded ${col} inline-block`}></span>
                                    <span className={dm ? 'text-stone-300' : 'text-stone-700'}>{label}</span>
                                </div>
                            ))}
                        </div>

                        <CalendarGrid
                            bookings={bookings}
                            currentCalDate={currentCalDate}
                            setCurrentCalDate={setCurrentCalDate}
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            setCheckInDate={setCheckInDate}
                            setCheckOutDate={setCheckOutDate}
                            showToast={showToast}
                        />

                        {checkInDate && checkOutDate && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-stone-900">
                                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Selected Dates</div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <div><span className="text-xs text-stone-500 block">Check-in:</span> {checkInDate}</div>
                                    <div className="text-stone-300">→</div>
                                    <div><span className="text-xs text-stone-500 block">Check-out:</span> {checkOutDate}</div>
                                </div>
                                <button onClick={() => { setCheckInDate(""); setCheckOutDate(""); }} className="text-[10px] text-rose-600 font-bold underline mt-2 block">Clear Selection</button>
                            </div>
                        )}
                    </div>

                    {/* Host Card */}
                    <div className="bg-stone-900 text-stone-50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-stone-800 rounded-full filter blur-2xl opacity-50"></div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block mb-1">Your Host</span>
                        <h4 className="font-serif text-lg font-semibold mb-1">{property.hostName}</h4>
                        <span className="inline-block text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full mb-3 font-semibold">🏆 Superhost</span>
                        <p className="text-xs text-stone-300 leading-relaxed mb-4">
                            "We strive to give our guests a seamless, peaceful sanctuary experience. Our home is designed for comfort, relaxation, and creating wonderful memories."
                        </p>
                        <div className="border-t border-stone-800 pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-stone-400">
                                <span>Response rate:</span>
                                <span className="text-emerald-400 font-semibold">100% / Within 10 mins</span>
                            </div>
                            <div className="flex justify-between text-stone-400">
                                <span>Inquiry Hotline:</span>
                                <span className="text-white font-medium">{property.hostPhone}</span>
                            </div>
                        </div>
                        <a
                            href={`https://wa.me/919876543210?text=Hi%20Mohan%2C%20I%27m%20interested%20in%20Samruddhi!`}
                            target="_blank"
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Message on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* REVIEWS — All reviews with pagination */}
            <section className={`py-16 px-4 border-y transition-colors duration-300 ${dm ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-4">
                        <span className={`text-xs font-mono uppercase tracking-widest block mb-2 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Guest Testimonials</span>
                        <h2 className={`font-serif text-3xl font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>What Our Guests Say</h2>
                        <p className={`text-sm mt-2 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
                            {REVIEWS.length} verified reviews from Airbnb guests
                        </p>
                    </div>

                    {/* Rating Summary */}
                    <div className={`flex justify-center mb-10`}>
                        <div className={`flex items-center gap-6 px-8 py-4 rounded-2xl border ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'} shadow-sm`}>
                            <div className="text-center">
                                <div className={`text-4xl font-serif font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>4.9</div>
                                <div className="flex gap-0.5 justify-center mt-1">
                                    {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                                </div>
                                <div className={`text-xs mt-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Overall Rating</div>
                            </div>
                            <div className={`w-px h-12 ${dm ? 'bg-stone-700' : 'bg-stone-200'}`}></div>
                            <div className="text-center">
                                <div className={`text-4xl font-serif font-bold ${dm ? 'text-white' : 'text-stone-950'}`}>{REVIEWS.length}</div>
                                <div className={`text-xs mt-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Total Reviews</div>
                            </div>
                            <div className={`w-px h-12 ${dm ? 'bg-stone-700' : 'bg-stone-200'}`}></div>
                            <div className="text-center">
                                <div className={`text-4xl font-serif font-bold text-amber-500`}>🏆</div>
                                <div className={`text-xs mt-1 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Superhost</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {visibleReviews.map((review: any, i: number) => (
                            <div key={i} className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between transition-all hover:shadow-md ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                                <div>
                                    <div className="flex gap-1 text-amber-500 mb-4">
                                        {[...Array(Math.floor(review.rating))].map((_, idx) => (
                                            <span key={idx} className="text-sm">★</span>
                                        ))}
                                    </div>
                                    <p className={`font-light italic text-sm leading-relaxed mb-6 ${dm ? 'text-stone-300' : 'text-stone-700'}`}>"{review.comment}"</p>
                                </div>
                                <div className={`flex items-center gap-3 pt-4 border-t ${dm ? 'border-stone-700' : 'border-stone-100'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dm ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-800'}`}>
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className={`font-semibold text-sm block ${dm ? 'text-white' : 'text-stone-900'}`}>{review.name}</span>
                                        <span className={`text-xs ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{review.location} · {review.date}</span>
                                    </div>
                                    <span className="ml-auto">
                                        <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-3 mt-10">
                        <button
                            onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                            disabled={reviewPage === 0}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 ${dm ? 'bg-stone-800 text-white hover:bg-stone-700' : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'}`}
                        >← Prev</button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setReviewPage(i)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${reviewPage === i ? (dm ? 'bg-white text-stone-950' : 'bg-stone-950 text-white') : (dm ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-600 border border-stone-200')}`}
                                >{i + 1}</button>
                            ))}
                        </div>
                        <button
                            onClick={() => setReviewPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={reviewPage >= totalPages - 1}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 ${dm ? 'bg-stone-800 text-white hover:bg-stone-700' : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'}`}
                        >Next →</button>
                    </div>

                    <div className="text-center mt-6">
                        <Link href={property.airbnbUrl} target="_blank" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-rose-500 transition-all underline underline-offset-2">
                            See all reviews on Airbnb →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
