"use client";
import React, { useState, useEffect, useRef } from 'react';

// --- INITIAL DATA & SEED STATES (Simulating PostgreSQL Records) ---
const INITIAL_PROPERTY_INFO = {
    title: "The Obsidian Pavilion",
    tagline: "Ultra-luxury architectural retreat with infinity views",
    description: "Suspended over a tranquil valley, The Obsidian Pavilion combines raw minimalist concrete architecture with warm, premium organic interiors. Designed by award-winning architects, this architectural sanctuary features floor-to-ceiling glass paneling, a sweeping cantilevered heated swimming pool, an outdoor cedar wood sauna, and curated modern art. Experience complete peace and seclusion while remaining only minutes away from world-class dining and trails.",
    guestCapacity: 6,
    bedrooms: 3,
    beds: 4,
    baths: 3.5,
    location: "Pacific Heights, California",
    pricePerNight: 850,
    airbnbUrl: "https://airbnb.com/h/obsidian-pavilion-luxury-demo",
    hostName: "Marcus & Elena",
    hostEmail: "concierge@obsidianpavilion.com",
    hostPhone: "+1 (415) 555-0192",
    images: [
        { id: 1, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", caption: "Architectural Exterior" },
        { id: 2, url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80", caption: "Sunken Modern Living Room" },
        { id: 3, url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", caption: "Primary Suite with Panoramic Panes" },
        { id: 4, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80", caption: "Heated Infinity Edge Pool" },
        { id: 5, url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", caption: "Chef's Kitchen & Marble Island" }
    ],
    amenities: [
        { id: "pool", label: "Heated Infinity Pool", active: true, icon: "pool" },
        { id: "sauna", label: "Cedar Wood Sauna", active: true, icon: "sauna" },
        { id: "kitchen", label: "Chef's Kitchen", active: true, icon: "chef" },
        { id: "fireplace", label: "Modernist Fireplace", active: true, icon: "fire" },
        { id: "wifi", label: "Starlink High-Speed Wi-Fi", active: true, icon: "wifi" },
        { id: "parking", label: "EV Charging Station Included", active: true, icon: "ev" },
        { id: "tub", label: "Outdoor Japanese Soaking Tub", active: true, icon: "tub" },
        { id: "gym", label: "Private Fitness Suite", active: false, icon: "gym" }
    ]
};

// Initial Seed Bookings (using exact Date Strings for ease of state calculations)
// Year 2026 dates (June & July)
const INITIAL_BOOKINGS = [
    // June 2026
    { date: "2026-06-05", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-06", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-07", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-18", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-19", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-20", status: "booked", source: "Airbnb Sync" },
    { date: "2026-06-21", status: "booked", source: "Airbnb Sync" },
    // Blocked dates
    { date: "2026-06-25", status: "blocked", reason: "Owner Maintenance", source: "Airbnb Sync" },
    { date: "2026-06-26", status: "blocked", reason: "Owner Maintenance", source: "Airbnb Sync" },
    // July 2026
    { date: "2026-07-02", status: "booked", source: "Airbnb Sync" },
    { date: "2026-07-03", status: "booked", source: "Airbnb Sync" },
    { date: "2026-07-04", status: "booked", source: "Airbnb Sync" },
    { date: "2026-07-14", status: "booked", source: "Airbnb Sync" },
    { date: "2026-07-15", status: "booked", source: "Airbnb Sync" },
    { date: "2026-07-28", status: "blocked", reason: "Deep Cleaning Window", source: "Airbnb Sync" }
];

const REVIEWS = [
    { name: "Sophia Mitchell", location: "London, UK", date: "May 2026", rating: 5, comment: "An architectural masterpiece. The views are incredible, the beds feel like clouds, and the outdoor barrel sauna is magical. Absolutely worth every penny." },
    { name: "Daniel Chen", location: "Singapore", date: "April 2026", rating: 5, comment: "I've stayed in luxury Airbnbs worldwide, but the Obsidian Pavilion stands alone. Marcus and Elena were phenomenal hosts with unparalleled attention to detail." },
    { name: "Alexandra V.", location: "New York, NY", date: "March 2026", rating: 5, comment: "Breathtaking minimalist concrete aesthetics coupled with high-end luxury details. Waking up to the floor-to-ceiling forest fog was unforgettable." }
];

export default function Home() {
    // --- APPLICATION STATES ---
    const [view, setView] = useState('guest'); // 'guest' | 'admin'
    const [property, setProperty] = useState(INITIAL_PROPERTY_INFO);
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [icalUrl, setIcalUrl] = useState("https://www.airbnb.com/calendar/ical/73918239.ics?s=f9a88e994270cb1b");
    const [lastSync, setLastSync] = useState(new Date("2026-06-16T19:30:00"));
    const [syncStatus, setSyncStatus] = useState("success"); // "success" | "syncing" | "failed"
    const [syncLogs, setSyncLogs] = useState([
        { time: "19:30:00", type: "success", msg: "Polled Airbnb calendar endpoint successfully. 0 changes detected." },
        { time: "19:25:00", type: "success", msg: "iCal feed processed. Saved 9 reservations and 3 blocked blocks." }
    ]);
    const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 5, 1)); // June 2026 (0-indexed month)

    // Custom Toast Message state instead of raw browser alerts
    const [toast, setToast] = useState(null);

    // Guest booking form choices
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guestsCount, setGuestsCount] = useState(2);

    // Admin lock panel
    const [adminPass, setAdminPass] = useState("");
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Trigger custom toast alert
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4500);
    };

    // --- AIRBNB ICAL SYNC ENGINE (SIMULATED PIPELINE) ---
    const triggerSync = () => {
        if (!icalUrl || !icalUrl.startsWith("http")) {
            showToast("Please provide a valid iCal URL address", "error");
            return;
        }

        setSyncStatus("syncing");
        const currentTimeStr = new Date().toLocaleTimeString();

        // Add initial log
        setSyncLogs(prev => [
            { time: currentTimeStr, type: "info", msg: `Polling Airbnb API target: ${icalUrl.substring(0, 35)}...` },
            ...prev
        ]);

        setTimeout(() => {
            // Step 2: Simulated fetching & database write
            const midTimeStr = new Date().toLocaleTimeString();
            setSyncLogs(prev => [
                { time: midTimeStr, type: "info", msg: "Parser reading VEVENT elements. Converting ISO sequences..." },
                { time: midTimeStr, type: "database", msg: "Open connection to PostgreSQL: updating transaction records." },
                ...prev
            ]);

            setTimeout(() => {
                const finalTimeStr = new Date().toLocaleTimeString();

                // Randomly simulate fresh booking block changes
                const randomDates = [
                    { date: "2026-06-11", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-06-12", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-07-10", status: "booked", source: "Airbnb Sync" },
                    { date: "2026-07-11", status: "booked", source: "Airbnb Sync" },
                ];

                // Check for any failures for realism
                if (Math.random() < 0.05) {
                    setSyncStatus("failed");
                    setSyncLogs(prev => [
                        { time: finalTimeStr, type: "error", msg: "Airbnb Server timed out (504 Gateway Timeout). Last valid DB state maintained." },
                        ...prev
                    ]);
                    showToast("Sync encountered a connection error. Retaining local cached records.", "error");
                    return;
                }

                setBookings(prev => {
                    // Merge while avoiding duplicate dates
                    const uniqueExisting = prev.filter(b => !randomDates.some(r => r.date === b.date));
                    return [...uniqueExisting, ...randomDates];
                });

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

    // Automated Poll Simulation (every 5 mins mock log)
    useEffect(() => {
        const timer = setInterval(() => {
            const timeStr = new Date().toLocaleTimeString();
            setSyncLogs(prev => [
                { time: timeStr, type: "success", msg: "Cron daemon executed. Auto-poll success: No remote updates needed." },
                ...prev
            ]);
        }, 60000 * 5);
        return () => clearInterval(timer);
    }, []);

    // Compute stats
    const totalBooked = bookings.filter(b => b.status === "booked").length;
    const totalBlocked = bookings.filter(b => b.status === "blocked").length;

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

            {/* Persistent Global Switch Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* Logo Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('guest')}>
                        <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-stone-50 font-semibold tracking-tighter">O</div>
                        <div>
                            <span className="font-semibold tracking-wider uppercase text-xs block text-stone-500">Boutique Portfolio</span>
                            <span className="font-serif text-lg leading-none font-bold text-stone-950">{property.title}</span>
                        </div>
                    </div>

                    {/* Quick Stats Panel / Real-time sync tracker (Aesthetic) */}
                    <div className="flex items-center gap-2 bg-stone-100 rounded-full px-3 py-1.5 text-xs text-stone-600 font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Airbnb Live Status:</span>
                        <span className="font-semibold text-stone-800 uppercase">{syncStatus === "success" ? "Synced" : syncStatus === "syncing" ? "Syncing..." : "Error"}</span>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <button
                            onClick={() => setView('guest')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${view === 'guest'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-900'
                                }`}
                        >
                            Guest Frontpage
                        </button>
                        <button
                            onClick={() => setView('admin')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 flex items-center gap-1.5 ${view === 'admin'
                                    ? 'bg-stone-950 text-white shadow-md'
                                    : 'text-stone-500 hover:text-stone-900'
                                }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Admin Controls
                        </button>
                    </div>

                </div>
            </header>

            {/* --- CONTENT AREA VIEW SELECTOR --- */}
            <main className="transition-all duration-300">
                {view === 'guest' ? (
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
                ) : (
                    <AdminDashboardView
                        property={property}
                        setProperty={setProperty}
                        bookings={bookings}
                        setBookings={setBookings}
                        icalUrl={icalUrl}
                        setIcalUrl={setIcalUrl}
                        lastSync={lastSync}
                        syncStatus={syncStatus}
                        triggerSync={triggerSync}
                        syncLogs={syncLogs}
                        totalBooked={totalBooked}
                        totalBlocked={totalBlocked}
                        isAdminAuthenticated={isAdminAuthenticated}
                        setIsAdminAuthenticated={setIsAdminAuthenticated}
                        adminPass={adminPass}
                        setAdminPass={setAdminPass}
                        showToast={showToast}
                    />
                )}
            </main>

            {/* Minimal Aesthetic Footer */}
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
                            <span className="text-xs text-stone-400 font-mono">Synced database: Postgres v15 Live</span>
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
                        <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">Architecture v1.0 Features</h4>
                        <div className="space-y-3">
                            <span className="inline-block bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded border border-stone-700 mr-2">Airbnb iCal Connector</span>
                            <span className="inline-block bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded border border-stone-700 mr-2">Direct Booking Engine Reserved</span>
                            <span className="inline-block bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded border border-stone-700 mr-2">Postgres Storage Mirror</span>
                            <span className="inline-block bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded border border-stone-700 mr-2">JSON-LD Metadata Generated</span>
                        </div>

                        <div className="mt-6 pt-4 border-t border-stone-800/80">
                            <p className="text-xs text-stone-500">
                                To test the live editing sync pipeline, switch to the <strong className="text-stone-400">Admin Controls</strong> tab at the top of the viewport.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
                    <p>© 2026 {property.title}. Designed as a luxury MVP. Direct redirection paths active.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <a href="#meta-preview" className="hover:underline">SEO Dynamic Tags</a>
                        <a href="#calendar-sec" className="hover:underline">Availability Hub</a>
                        <span className="text-stone-700">|</span>
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
}) {
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // Quick CTA form calculation 
    const handleRedirectToAirbnb = (e) => {
        e.preventDefault();
        if (!checkInDate || !checkOutDate) {
            showToast("Select your check-in and check-out dates on the availability calendar first, then we will forward you to Airbnb to complete reservation.", "info");
            return;
        }

        // Redirect simulation logic
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
                {/* Parallax Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={property.images[0]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"}
                        alt="Luxury Villa"
                        className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-1000 transform hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/35 to-transparent"></div>
                </div>

                {/* Hero Overlay Panel */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-8 pb-12 md:pb-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                        <div className="max-w-3xl">
                            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block mb-3">
                                ★ 4.98 Rating · Verified Airbnb Source
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-none tracking-tight mb-4">
                                {property.title}
                            </h1>
                            <p className="text-stone-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                {property.tagline}
                            </p>
                        </div>

                        {/* Quick check floating card */}
                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-stone-200 w-full md:w-96 text-stone-900">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-xs text-stone-500 uppercase block tracking-wider">Starting from</span>
                                    <span className="text-2xl font-serif font-bold text-stone-950">${property.pricePerNight}</span>
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

                {/* Left Columns - Description, Gallery Grid, Amenities */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Main Copy */}
                    <div>
                        <h3 className="font-serif text-3xl font-bold text-stone-950 mb-6">About this Sanctuary</h3>
                        <p className="text-stone-700 leading-relaxed text-lg font-light mb-4">
                            {property.description}
                        </p>
                    </div>

                    {/* Luxury Gallery View */}
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-4">The Experience in Frame</h3>
                        <p className="text-xs text-stone-500 mb-6">Click any photograph below to cycle and preview the grand spaces.</p>

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

                            {/* Prev / Next controls */}
                            <button
                                onClick={() => setActiveImageIdx(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setActiveImageIdx(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/90 text-white hover:text-stone-950 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow"
                            >
                                →
                            </button>
                        </div>

                        {/* Thumbnail selector */}
                        <div className="grid grid-cols-5 gap-2">
                            {property.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIdx ? 'border-stone-950 scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Grid */}
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-6">Designed for Sophistication</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.amenities.filter(a => a.active).map((amenity) => (
                                <div key={amenity.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-stone-200/60 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 font-bold">
                                        {getAmenityIcon(amenity.icon)}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-stone-900 block">{amenity.label}</span>
                                        <span className="text-[10px] text-emerald-600 font-medium">Complimentary Option</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Columns - Fixed Sidebar for details/calendar */}
                <div id="calendar-sec" className="lg:col-span-4 space-y-8">

                    {/* Main Visual Calendar Hub */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200">
                        <div className="flex flex-col mb-4">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">Availability Matrix</span>
                            <h4 className="font-serif text-xl font-bold text-stone-950">Airbnb Sync Calendar</h4>
                        </div>

                        {/* Legend */}
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

                        {/* Calendar Body */}
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

                        {/* Selected Booking Indicator Box */}
                        {checkInDate && checkOutDate && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-stone-900">
                                <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Proposed Dates</div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <div>
                                        <span className="text-xs text-stone-500 block">Check-in:</span> {checkInDate}
                                    </div>
                                    <div className="text-stone-300">→</div>
                                    <div>
                                        <span className="text-xs text-stone-500 block">Check-out:</span> {checkOutDate}
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setCheckInDate(""); setCheckOutDate(""); }}
                                    className="text-[10px] text-rose-600 font-bold underline mt-2 block"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}

                        <div className="mt-4 bg-stone-50 rounded-xl p-3 border border-stone-200/60 text-xs text-stone-500 leading-relaxed">
                            <strong>Source of Truth Protection:</strong> If you select dates marked <span className="text-rose-600 font-bold">Booked</span> or <span className="text-stone-600 font-bold">Blocked</span>, the engine will safely disable bookings. Dates are pulled every 5 minutes from Airbnb servers.
                        </div>

                    </div>

                    {/* Quick host block */}
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

            {/* 4. PREMIUM TESTIMONIALS */}
            <section className="bg-stone-100 py-16 px-4 border-y border-stone-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-2">Guest Testimonials</span>
                        <h3 className="font-serif text-3xl font-bold text-stone-950">A Five-Star Standard</h3>
                        <p className="text-stone-600 text-sm mt-2">Verified stays imported from verified luxury portfolios.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {REVIEWS.map((review, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 relative flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-1 text-amber-500 mb-4">
                                        {[...Array(review.rating)].map((_, idx) => (
                                            <span key={idx} className="text-sm">★</span>
                                        ))}
                                    </div>
                                    <p className="text-stone-700 font-light italic text-sm leading-relaxed mb-6">
                                        "{review.comment}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-800 text-xs">
                                        {review.name.charAt(0)}
                                    </div>
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

            {/* 5. LOCATION & LANDMARK MAP COMPONENT */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block mb-2">Secluded Location</span>
                    <h3 className="font-serif text-3xl font-bold text-stone-950">Pacific Heights San Francisco</h3>
                    <p className="text-stone-600 text-sm mt-2">Perfect balance of isolated forest canopy views and quick metropolitan access.</p>
                </div>

                <div className="bg-stone-100 rounded-3xl p-4 border border-stone-200 overflow-hidden relative shadow-lg">

                    {/* Simulated Premium Canvas Map Mapbox Style */}
                    <div className="h-96 rounded-2xl bg-sky-100 relative overflow-hidden flex items-center justify-center">

                        {/* Aesthetic topographic landscape pattern simulation */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        {/* Draw Simulated Scenic Map Layers */}
                        <div className="absolute top-1/3 left-1/4 w-3/4 h-8 bg-stone-200 rounded-full transform -rotate-12"></div>
                        <div className="absolute top-1/2 left-0 w-full h-12 bg-sky-200/60 transform rotate-6"></div>

                        {/* Forests overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 rounded-full bg-emerald-100/50 filter blur-xl"></div>
                        </div>

                        {/* Location marker dot */}
                        <div className="absolute z-10 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-stone-950 text-white flex items-center justify-center shadow-2xl animate-bounce">
                                🏰
                            </div>
                            <div className="mt-2 bg-stone-900 text-white font-mono text-[10px] tracking-widest px-3 py-1 rounded shadow-md uppercase">
                                {property.title}
                            </div>
                        </div>

                        {/* Compass rose */}
                        <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-stone-200 text-[10px] text-stone-600 font-mono">
                            <p>N 37.7915° / W 122.4356°</p>
                            <p className="text-stone-400">Elevation: 290ft</p>
                        </div>

                        {/* Travel metrics widget */}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl max-w-xs">
                            <h5 className="font-semibold text-xs text-stone-900 mb-2">Proximity Highlights</h5>
                            <div className="space-y-1.5 text-[11px] text-stone-600">
                                <div className="flex justify-between">
                                    <span>🌲 Marin Headlands Trails:</span>
                                    <strong>12 mins drive</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>🍷 Michelin Row Dining:</span>
                                    <strong>5 mins walk</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>✈️ SFO Airport Access:</span>
                                    <strong>25 mins drive</strong>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* 6. SEO METADATA INSPECTOR (Required v1.0 Feature Display) */}
            <section id="meta-preview" className="max-w-4xl mx-auto px-4 mt-8">
                <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200 text-stone-800">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="font-mono text-xs uppercase tracking-widest text-stone-600 font-bold">Dynamic SEO Controller Active (v1.0)</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-stone-950 mb-2">Search Engine Optimization Metadata Engine</h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                        Our framework dynamically compiles metadata, Open Graph records, and JSON-LD structured tags to secure top-tier luxury property rankings. To modify this live state, adjust fields within the <strong>Admin Controls</strong> panel.
                    </p>

                    <div className="bg-stone-950 text-stone-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto space-y-1">
                        <p className="text-emerald-400">{"<title>"} {property.title} | Luxury Vacation Rental {"</title>"}</p>
                        <p className="text-emerald-400">{"<meta name=\"description\" content=\""} {property.description.substring(0, 110)}... {"\" />"}</p>
                        <p className="text-stone-400">{"<meta property=\"og:title\" content=\""} {property.title} - {property.tagline} {"\" />"}</p>
                        <p className="text-stone-400">{"<meta property=\"og:image\" content=\""} {property.images[0]?.url.substring(0, 50)}... {"\" />"}</p>
                        <p className="text-amber-400">{"<script type=\"application/ld+json\">"}</p>
                        <p className="text-stone-300 pl-4">{JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LodgingBusiness",
                            "name": property.title,
                            "description": property.tagline,
                            "image": property.images[0]?.url,
                            "telephone": property.hostPhone,
                            "address": property.location,
                            "numberOfRooms": property.bedrooms,
                            "occupancyLimit": property.guestCapacity
                        }, null, 2).split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}</p>
                        <p className="text-amber-400">{"</script>"}</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

// ==========================================
// --- ADMIN CONTROL & CONFIGURATION PORTAL ---
// ==========================================
function AdminDashboardView({
    property,
    setProperty,
    bookings,
    setBookings,
    icalUrl,
    setIcalUrl,
    lastSync,
    syncStatus,
    triggerSync,
    syncLogs,
    totalBooked,
    totalBlocked,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminPass,
    setAdminPass,
    showToast
}) {

    // Form states initialized from property prop
    const [editedTitle, setEditedTitle] = useState(property.title);
    const [editedTagline, setEditedTagline] = useState(property.tagline);
    const [editedDescription, setEditedDescription] = useState(property.description);
    const [editedPrice, setEditedPrice] = useState(property.pricePerNight);
    const [editedCapacity, setEditedCapacity] = useState(property.guestCapacity);
    const [editedLocation, setEditedLocation] = useState(property.location);
    const [editedHostName, setEditedHostName] = useState(property.hostName);
    const [editedHostEmail, setEditedHostEmail] = useState(property.hostEmail);
    const [editedHostPhone, setEditedHostPhone] = useState(property.hostPhone);
    const [editedAirbnbUrl, setEditedAirbnbUrl] = useState(property.airbnbUrl);

    // New Image addition row states
    const [newImgUrl, setNewImgUrl] = useState("");
    const [newImgCaption, setNewImgCaption] = useState("");

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminPass === "admin123" || adminPass.toLowerCase() === "admin") {
            setIsAdminAuthenticated(true);
            showToast("Access granted to property management portal", "success");
        } else {
            showToast("Invalid password key. (Hint: enter 'admin')", "error");
        }
    };

    const savePropertyInfo = (e) => {
        e.preventDefault();
        setProperty(prev => ({
            ...prev,
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
        }));
        showToast("Properties mapped and successfully persisted to simulated PostgreSQL database!", "success");
    };

    const handleToggleAmenity = (id) => {
        setProperty(prev => {
            const updated = prev.amenities.map(am => {
                if (am.id === id) return { ...am, active: !am.active };
                return am;
            });
            return { ...prev, amenities: updated };
        });
        showToast("Amenity status updated", "success");
    };

    const handleAddNewImage = () => {
        if (!newImgUrl || !newImgCaption) {
            showToast("Please provide both image URL and descriptive caption text", "error");
            return;
        }
        setProperty(prev => ({
            ...prev,
            images: [
                ...prev.images,
                { id: Date.now(), url: newImgUrl, caption: newImgCaption }
            ]
        }));
        setNewImgUrl("");
        setNewImgCaption("");
        showToast("New space asset linked to the home gallery!", "success");
    };

    const handleRemoveImage = (id) => {
        if (property.images.length <= 1) {
            showToast("At least one hero gallery image must persist at all times.", "error");
            return;
        }
        setProperty(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
        showToast("Property image detached", "info");
    };

    const handleResetCalendar = () => {
        setBookings(INITIAL_BOOKINGS);
        showToast("Calendar sync blocks reset to pristine Airbnb seed values", "info");
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-2xl shadow-xl border border-stone-200">
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

                <div className="mt-6 pt-4 border-t border-stone-100 text-[10px] text-stone-400 text-center leading-relaxed">
                    Security policy: Mock v1.0 local developer loop active. Bypass by keying in standard test credentials.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">

            {/* Admin Title Board */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-stone-200 mb-8">
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">Property Administration Area</span>
                    <h2 className="font-serif text-3xl font-bold text-stone-950">Control Console Dashboard</h2>
                    <p className="text-stone-500 text-xs mt-1">PostgreSQL v15 Direct Storage API & Airbnb Sync Controller</p>
                </div>

                <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                    Lock Administrative Portal
                </button>
            </div>

            {/* Grid: Columns of Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Sync Engine (ICS Input + Live Engine log output) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Airbnb Integration Module */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                        <h3 className="font-serif text-lg font-bold text-stone-950 mb-4 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                            Airbnb iCal Sync Center
                        </h3>

                        {/* Micro stats widgets */}
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

                            {/* Success metadata display */}
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

                    {/* Sync Engine Simulation Log Output Terminal */}
                    <div className="bg-stone-950 text-stone-300 rounded-2xl p-6 border border-stone-900 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">Sync Engine Log Console</h4>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>

                        <div className="h-64 overflow-y-auto space-y-3 font-mono text-[10px] text-stone-400 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                            {syncLogs.map((log, index) => (
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

                        <div className="text-[10px] text-stone-500 mt-3 leading-relaxed">
                            Logs indicate background processes executing to the mock PostgreSQL connection layer. Click <strong className="text-emerald-400">Manual 'Sync Now'</strong> to observe active state changes.
                        </div>
                    </div>

                </div>

                {/* Right Column: Database Modification Panel */}
                <div className="lg:col-span-8 space-y-6">

                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                        <h3 className="font-serif text-lg font-bold text-stone-950 mb-6 flex items-center gap-2">
                            📂 Property Copywriting & Settings DB Core
                        </h3>

                        <form onSubmit={savePropertyInfo} className="space-y-6">

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
                                        onChange={(e) => setEditedPrice(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Max Guests</label>
                                    <input
                                        type="number"
                                        value={editedCapacity}
                                        onChange={(e) => setEditedCapacity(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Location Coordinates/Label</label>
                                    <input
                                        type="text"
                                        value={editedLocation}
                                        onChange={(e) => setEditedLocation(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Listing host</label>
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
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Direct Contact Email</label>
                                    <input
                                        type="email"
                                        value={editedHostEmail}
                                        onChange={(e) => setEditedHostEmail(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Host Contact Hotline</label>
                                    <input
                                        type="text"
                                        value={editedHostPhone}
                                        onChange={(e) => setEditedHostPhone(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-500 font-bold block mb-1">Airbnb Direct Redirect URL</label>
                                    <input
                                        type="text"
                                        value={editedAirbnbUrl}
                                        onChange={(e) => setEditedAirbnbUrl(e.target.value)}
                                        className="w-full text-xs bg-stone-50 border border-stone-200 p-2.5 rounded-xl focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Save Trigger button */}
                            <div>
                                <button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl shadow transition"
                                >
                                    Apply & Save Core Copy to PostgreSQL Database
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Amenities Live Settings Editor */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                        <h3 className="font-serif text-lg font-bold text-stone-950 mb-4">
                            Toggle Live Amenities Catalog
                        </h3>
                        <p className="text-xs text-stone-500 mb-4">Select amenities to publish on the customer-facing guest website instantly.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {property.amenities.map(am => (
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

                    {/* Photo Assets Manager */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                        <h3 className="font-serif text-lg font-bold text-stone-950 mb-4">
                            Property Photo Assets Manager
                        </h3>

                        {/* List and manage images */}
                        <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
                            {property.images.map(img => (
                                <div key={img.id} className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                                    <div className="flex items-center gap-3">
                                        <img src={img.url} className="w-12 h-12 object-cover rounded-md" alt="preview" />
                                        <div>
                                            <span className="font-medium text-stone-900 block truncate max-w-xs">{img.caption}</span>
                                            <span className="text-[10px] text-stone-500 truncate max-w-xs block">{img.url}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveImage(img.id)}
                                        className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Form: Add image */}
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                            <h4 className="text-xs font-bold text-stone-700 uppercase mb-3">Add Custom Image Asset</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Paste Unsplash or external Image URL..."
                                    value={newImgUrl}
                                    onChange={(e) => setNewImgUrl(e.target.value)}
                                    className="text-xs bg-white border border-stone-200 p-2.5 rounded-lg focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Asset label (e.g. Cedar Barrel Bath)"
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

        </div>
    );
}

// ==========================================
// --- INTERACTIVE AV_CALENDAR COMPONENT ---
// ==========================================
function CalendarGrid({
    bookings,
    currentCalDate,
    setCurrentCalDate,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    showToast
}) {
    const year = currentCalDate.getFullYear();
    const monthIdx = currentCalDate.getMonth(); // 0-based index

    // Month metadata
    const monthName = currentCalDate.toLocaleString('default', { month: 'long' });
    const firstDayIndex = new Date(year, monthIdx, 1).getDay(); // Sunday=0, Monday=1, ...
    const totalDaysInMonth = new Date(year, monthIdx + 1, 0).getDate();

    // Date helper string builder: e.g., '2026-06-05'
    const getDateString = (dayNum) => {
        const formattedMonth = String(monthIdx + 1).padStart(2, '0');
        const formattedDay = String(dayNum).padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    // Check state of individual dates
    const getDateStatus = (dayNum) => {
        const dateStr = getDateString(dayNum);
        const matchedRecord = bookings.find(b => b.date === dateStr);
        return matchedRecord ? matchedRecord.status : "available"; // booked | blocked | available
    };

    // Nav month triggers
    const handleNextMonth = () => {
        setCurrentCalDate(new Date(year, monthIdx + 1, 1));
    };
    const handlePrevMonth = () => {
        setCurrentCalDate(new Date(year, monthIdx - 1, 1));
    };

    // Date cell selection click
    const handleCellClick = (dayNum) => {
        const dateStr = getDateString(dayNum);
        const status = getDateStatus(dayNum);

        if (status === "booked" || status === "blocked") {
            showToast(`This date is ${status === 'booked' ? 'fully booked on Airbnb' : 'blocked by the estate owner'}. Select another date instead.`, "error");
            return;
        }

        // Interactive booking sequence
        if (!checkInDate || (checkInDate && checkOutDate)) {
            setCheckInDate(dateStr);
            setCheckOutDate("");
            showToast(`Selected check-in: ${dateStr}. Now select an available check-out date.`, "info");
        } else {
            // Placing check out date
            if (new Date(dateStr) <= new Date(checkInDate)) {
                // Selected preceding checkin, set it as new checkin instead
                setCheckInDate(dateStr);
                setCheckOutDate("");
                showToast(`Reset. Check-in set to: ${dateStr}. Select check-out next.`, "info");
            } else {
                // Ensure no booked/blocked intervals lie inside the select range
                let tempDate = new Date(checkInDate);
                let blockFound = false;
                while (tempDate <= new Date(dateStr)) {
                    const dateStringCheck = tempDate.toISOString().split('T')[0];
                    const checkStatus = bookings.find(b => b.date === dateStringCheck)?.status;
                    if (checkStatus === "booked" || checkStatus === "blocked") {
                        blockFound = true;
                        break;
                    }
                    tempDate.setDate(tempDate.getDate() + 1);
                }

                if (blockFound) {
                    showToast("A booked/blocked period occurs within this span. Please select a continuous block of green available dates.", "error");
                } else {
                    setCheckOutDate(dateStr);
                    showToast(`Date range chosen! Confirm booking by selecting the reservation button.`, "success");
                }
            }
        }
    };

    // Calculate day cells array
    const dayCells = [];
    // Filler days for empty start gaps
    for (let i = 0; i < firstDayIndex; i++) {
        dayCells.push({ day: null, status: "disabled" });
    }
    // Month active cells
    for (let d = 1; d <= totalDaysInMonth; d++) {
        dayCells.push({ day: d, status: getDateStatus(d) });
    }

    // Weekdays headers
    const weekDayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="border border-stone-100 rounded-2xl p-2 bg-stone-50/50">

            {/* Selector Head */}
            <div className="flex justify-between items-center mb-3 px-1">
                <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded hover:bg-stone-200 transition text-stone-600 font-bold"
                >
                    ‹
                </button>
                <span className="font-serif text-sm font-semibold text-stone-900">
                    {monthName} {year}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="p-1 rounded hover:bg-stone-200 transition text-stone-600 font-bold"
                >
                    ›
                </button>
            </div>

            {/* Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-stone-400 font-bold mb-1">
                {weekDayLabels.map((lbl, i) => (
                    <span key={i} className="py-1">{lbl}</span>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {dayCells.map((cell, idx) => {
                    if (cell.day === null) {
                        return <div key={`empty-${idx}`} className="h-8"></div>;
                    }

                    const dayDateStr = getDateString(cell.day);
                    const isSelectedCheckin = checkInDate === dayDateStr;
                    const isSelectedCheckout = checkOutDate === dayDateStr;
                    const isInSelectedRange = checkInDate && checkOutDate &&
                        new Date(dayDateStr) >= new Date(checkInDate) &&
                        new Date(dayDateStr) <= new Date(checkOutDate);

                    // Build dynamic color classes
                    let bgClass = "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200/80";
                    if (cell.status === "booked") {
                        bgClass = "bg-rose-100 border-rose-300 text-rose-800 line-through cursor-not-allowed";
                    } else if (cell.status === "blocked") {
                        bgClass = "bg-stone-200 border-stone-300 text-stone-600 cursor-not-allowed";
                    }

                    // Active range overrides
                    if (isSelectedCheckin || isSelectedCheckout) {
                        bgClass = "bg-stone-950 border-stone-950 text-white font-bold ring-2 ring-stone-950 ring-offset-1";
                    } else if (isInSelectedRange) {
                        bgClass = "bg-stone-800 border-stone-800 text-stone-50 font-medium";
                    }

                    return (
                        <button
                            key={`day-${cell.day}`}
                            onClick={() => handleCellClick(cell.day)}
                            className={`h-8 w-8 text-[11px] rounded flex items-center justify-center font-semibold border transition-all ${bgClass}`}
                            title={`${dayDateStr} - Status: ${cell.status}`}
                        >
                            {cell.day}
                        </button>
                    );
                })}
            </div>

        </div>
    );
}

// ==========================================
// --- MOCK INLINE SVG ICONS MAPPER ---
// ==========================================
function getAmenityIcon(iconName) {
    switch (iconName) {
        case "pool":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M11.025 21H13a2 2 0 002-2v-1a2 2 0 012-2 2 2 0 002-2V8a2 2 0 00-2-2h-1a2 2 0 01-2-2m-1-1v1.5A2.5 2.5 0 019.5 7H9" />
                </svg>
            );
        case "sauna":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        case "chef":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            );
        case "fire":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
            );
        case "wifi":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.14 0M1.398 6.505a16.5 16.5 0 0121.204 0" />
                </svg>
            );
        case "ev":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
        case "tub":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            );
        default:
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
            );
    }
}