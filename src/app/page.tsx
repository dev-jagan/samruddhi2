"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPropertyInfo, getBookings, REVIEWS } from './data';
import { CalendarGrid, getAmenityIcon } from './components';

export default function Home() {
    // --- APPLICATION STATES ---
    const [property, setProperty] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 5, 1)); // June 2026

    // Custom Toast Message state
    const [toast, setToast] = useState<any>(null);

    // Guest booking form choices
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guestsCount, setGuestsCount] = useState(2);

    useEffect(() => {
        setProperty(getPropertyInfo());
        setBookings(getBookings());
    }, []);

    // Trigger custom toast alert
    const showToast = (message: string, type: string = "success") => {
        setToast({ message, type } as any);
        setTimeout(() => {
            setToast(null);
        }, 4500);
    };

    if (!property) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-500">Loading Samruddhi Experience...</div>;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-200">

            {/* Toast Alert Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all border transform translate-y-0 ${toast.type === 'error'
                        ? 'bg-rose-50 border-rose-150 text-rose-800'
                        : 'bg-stone-900 border-stone-800 text-stone-50'
                    }`}>
                    <div className="text-sm font-medium">{toast.message}</div>
                    <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white font-bold ml-2">×</button>
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* Logo Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-stone-50 font-semibold tracking-tighter">O</div>
                        <div>
                            <span className="font-semibold tracking-wider uppercase text-xs block text-stone-500">Boutique Portfolio</span>
                            <span className="font-serif text-lg leading-none font-bold text-stone-950">{property.title}</span>
                        </div>
                    </Link>

                    {/* Airbnb Live Status (Aesthetic) */}
                    <div className="flex items-center gap-2 bg-stone-100 rounded-full px-3 py-1.5 text-xs text-stone-600 font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Airbnb Live Status:</span>
                        <span className="font-semibold text-stone-800 uppercase">Synced</span>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase bg-white text-stone-900 shadow-sm"
                        >
                            Guest Frontpage
                        </Link>
                        <Link
                            href="/admin"
                            className="px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5 text-stone-500 hover:text-stone-900"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Admin Portal
                        </Link>
                    </div>

                </div>
            </header>

            <main className="transition-all duration-300">
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
                />
            </main>

            <footer className="bg-stone-900 text-stone-300 py-16 px-4 border-t border-stone-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-stone-50 text-stone-950 flex items-center justify-center font-bold">O</div>
                            <span className="font-serif text-lg font-bold text-white tracking-wide">{property.title}</span>
                        </div>
                        <p className="text-stone-400 text-sm leading-relaxed mb-6">
                            A meticulously designed private estate utilizing state-of-the-art Airbnb integration as our single point of calendar coordination. Experience next-generation luxury booking availability.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-stone-400 font-mono">Synced database: Real-time iCal Feed</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">The Property & Host</h4>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li>Address: {property.location}</li>
                            <li>Capacity: Up to {property.guestCapacity} guests</li>
                            <li>Direct Line: {property.hostPhone}</li>
                            <li>Official Support: {property.hostEmail}</li>
                            <li>Host Rep: {property.hostName}</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">Direct Booking Redirection</h4>
                        <p className="text-stone-400 text-sm leading-relaxed mb-4">
                            We use Airbnb as our primary booking engine to ensure your reservation is secure and synchronized across all platforms.
                        </p>
                        <Link href={property.airbnbUrl} target="_blank" className="inline-block bg-stone-800 hover:bg-stone-700 text-white text-xs px-4 py-2 rounded-lg border border-stone-700 transition-all">
                            View on Airbnb
                        </Link>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
                    <p>© 2026 {property.title}. Experience Prosperity and Comfort.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <span className="text-emerald-500">Airbnb Primary Key Active</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// ==========================================
// --- GUEST VIEW (THE LUXURY HOMEPAGE) ---
// ==========================================
function GuestHomepageView({
    property,
    bookings,
    currentCalDate,
    setCurrentCalDate,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    guestsCount,
    setGuestsCount,
    showToast
}: any) {
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    const handleRedirectToAirbnb = (e: any) => {
        e.preventDefault();
        if (!checkInDate || !checkOutDate) {
            showToast("Select your check-in and check-out dates on the availability calendar first, then we will forward you to Airbnb to complete reservation.", "info");
            return;
        }

        const airbnbUrlWithDates = `${property.airbnbUrl}?checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guestsCount}`;
        showToast("Opening direct booking path on Airbnb with preselected dates...", "success");
        setTimeout(() => {
            window.open(airbnbUrlWithDates, "_blank");
        }, 1200);
    };

    return (
        <div className="animate-fadeIn pb-24">

            {/* 1. HERO SECTION */}
            <section className="relative h-[85vh] bg-stone-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={property.images[0]?.url}
                        alt="Luxury Villa"
                        className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-1000 transform hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/35 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-12 md:pb-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div className="max-w-3xl">
                            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                ★ 5.0 Rating · Exceptional Samruddhi Stay
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-none tracking-tight mb-4">
                                {property.title}
                            </h1>
                            <p className="text-stone-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                {property.tagline}
                            </p>
                        </div>

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
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            className="w-full bg-transparent text-xs text-stone-800 font-medium focus:outline-none"
                                        />
                                    </div>
                                    <div className="border border-stone-200 rounded-lg p-2 bg-stone-50">
                                        <label className="text-[10px] text-stone-500 uppercase font-semibold block">Check-out</label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            className="w-full bg-transparent text-xs text-stone-800 font-medium focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="border border-stone-200 rounded-lg p-2 bg-stone-50">
                                    <label className="text-[10px] text-stone-500 uppercase font-semibold block">Guests Limit</label>
                                    <select
                                        value={guestsCount}
                                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                                        className="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none"
                                    >
                                        {[...Array(property.guestCapacity)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-stone-950 hover:bg-stone-900 text-white font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    Confirm & Reserve on Airbnb
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                            <div className="text-center mt-3 text-[10px] text-stone-500 font-medium">
                                🔒 Synced calendar prevents overlapping or double bookings.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SPECIFICATIONS BAR */}
            <section className="bg-white border-b border-stone-200 py-6 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-6 text-stone-700">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Guest Capacity</span>
                            <span className="text-sm font-semibold text-stone-900">{property.guestCapacity} Adults Max</span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-stone-200 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div>
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Architectural Space</span>
                            <span className="text-sm font-semibold text-stone-900">{property.bedrooms} Bedrooms · {property.beds} Beds</span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-stone-200 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Sanitation Level</span>
                            <span className="text-sm font-semibold text-stone-900">{property.baths} Bathrooms</span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-stone-200 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1.5 rounded-full font-mono border border-emerald-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Synced Engine
                        </span>
                    </div>
                </div>
            </section>

            {/* 3. CORE PRESENTATION & GALLERY */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div>
                        <h3 className="font-serif text-3xl font-bold text-stone-950 mb-6">About this Sanctuary</h3>
                        <p className="text-stone-700 leading-relaxed text-lg font-light mb-4 whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-4">The Experience in Frame</h3>
                        <div className="relative h-[450px] rounded-2xl overflow-hidden bg-stone-100 mb-4 border border-stone-200 group">
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
                                <span className="text-stone-300 font-mono text-sm">
                                    {activeImageIdx + 1} / {property.images.length}
                                </span>
                            </div>

                            <button
                                onClick={() => setActiveImageIdx(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow"
                            >←</button>
                            <button
                                onClick={() => setActiveImageIdx(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow"
                            >→</button>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {property.images.map((img: any, idx: number) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIdx ? 'border-stone-950 scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-6">Designed for Sophistication</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.amenities.filter((a: any) => a.active).map((amenity: any) => (
                                <div key={amenity.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-stone-200/60 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 font-bold">
                                        {getAmenityIcon(amenity.icon)}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-stone-900 block">{amenity.label}</span>
                                        <span className="text-[10px] text-emerald-600 font-medium">Included</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div className="pt-8">
                        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-6">Location & Surroundings</h3>
                        <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-stone-200 shadow-lg bg-stone-100">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.280173822452!2d74.8488346!3d12.8896593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a39626359f1%3A0xe53046f17e250170!2sLandlinks%20Layout%2C%20Ashok%20Nagar%2C%20Mangaluru%2C%20Karnataka%20575006!5e0!3m2!1sen!2sin!4v1718700000000!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <p className="mt-4 text-xs text-stone-500 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                        </p>
                    </div>

                </div>

                <div id="calendar-sec" className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200">
                        <div className="flex flex-col mb-4">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">Availability Matrix</span>
                            <h4 className="font-serif text-xl font-bold text-stone-950">Airbnb Sync Calendar</h4>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-3 bg-stone-50 rounded-xl px-2 mb-4 text-[10px] font-mono border border-stone-100">
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                                <span className="text-stone-700">Available</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
                                <span className="text-stone-700">Booked</span>
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded bg-stone-400 inline-block"></span>
                                <span className="text-stone-700">Blocked</span>
                            </div>
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
                                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Proposed Dates</div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <div><span className="text-xs text-stone-500 block">Check-in:</span> {checkInDate}</div>
                                    <div className="text-stone-300">→</div>
                                    <div><span className="text-xs text-stone-500 block">Check-out:</span> {checkOutDate}</div>
                                </div>
                                <button
                                    onClick={() => { setCheckInDate(""); setCheckOutDate(""); }}
                                    className="text-[10px] text-rose-600 font-bold underline mt-2 block"
                                >Clear Selection</button>
                            </div>
                        )}
                    </div>

                    <div className="bg-stone-900 text-stone-50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-stone-800 rounded-full filter blur-2xl opacity-50"></div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block mb-1">Your Hosts</span>
                        <h4 className="font-serif text-lg font-semibold mb-3">{property.hostName}</h4>
                        <p className="text-xs text-stone-300 leading-relaxed mb-4">
                            "We strive to give our guests a seamless, peaceful sanctuary experience. Our automated live iCal pricing sync avoids tedious manual queries."
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
                    </div>
                </div>
            </section>

            <section className="bg-stone-100 py-16 px-4 border-y border-stone-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-2">Guest Testimonials</span>
                        <h3 className="font-serif text-3xl font-bold text-stone-950">A Five-Star Standard</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {REVIEWS.map((review: any, i: number) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 relative flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-1 text-amber-500 mb-4">
                                        {[...Array(Math.floor(review.rating))].map((_, idx) => (
                                            <span key={idx} className="text-sm">★</span>
                                        ))}
                                    </div>
                                    <p className="text-stone-700 font-light italic text-sm leading-relaxed mb-6">"{review.comment}"</p>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-800 text-xs">{review.name.charAt(0)}</div>
                                    <div>
                                        <span className="font-semibold text-sm text-stone-900 block">{review.name}</span>
                                        <span className="text-xs text-stone-500">{review.location} · {review.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
