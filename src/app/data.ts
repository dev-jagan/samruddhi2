// --- INITIAL DATA & SEED STATES (Simulating PostgreSQL Records) ---

export const INITIAL_PROPERTY_INFO = {
    title: "Samruddhi",
    tagline: "Prosperity in everything you do",
    description: "Fully furnished home with state of art interiors & ambient modern lightings with spacious living area & bedrooms. Modern kitchen with all required equipment and provision to cook yourself. Perfect place for relaxed stay for two to three families. \n\nSituated in a quiet locality proximity to popular establishments and attractions. Make your stay more memorable by staying at our home to get a feel of your(dream) home.",
    guestCapacity: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    location: "Landlinks Layout, Ashok Nagar, Mangaluru, Karnataka",
    pricePerNight: 850,
    airbnbUrl: "https://www.airbnb.com/rooms/1144005697334700762",
    hostName: "Mohan Nagesh Shenoy",
    hostEmail: "mohan@samruddhi.com",
    hostPhone: "+91 9876543210",
    images: [
        { id: 1, url: "/images/2c781291-fff0-4385-b1cf-4f9bf1fc01cf.jpg.jpeg", caption: "Premium Exterior View" },
        { id: 2, url: "/images/1fd428c9-8729-420a-be13-6f9d357eeea2.jpg.jpeg", caption: "Ambient Living Area" },
        { id: 3, url: "/images/00f6fa1b-f20b-46f4-9e50-b495a9e7c4d8.jpg.jpeg", caption: "Modern Gourmet Kitchen" },
        { id: 4, url: "/images/2d132371-d86d-43b0-8349-f769ee45b909.jpeg", caption: "Spacious Master Bedroom" },
        { id: 5, url: "/images/43b049f7-646d-4426-bbad-59057e92f2ef.jpeg", caption: "Elegant Dining Space" },
        { id: 6, url: "/images/0f952b75-b02a-40fc-aee8-78ead811a7dd.jpeg", caption: "Cozy Corner" },
        { id: 7, url: "/images/607c8a98-f957-45ec-85b4-dee194d75b3d.jpeg", caption: "Modern Bathroom" },
        { id: 8, url: "/images/66c0a3a3-115c-42d6-b6fb-c892bd98e2a9.jpeg", caption: "Living Room View" },
        { id: 9, url: "/images/8a49bfdd-4c21-46ae-b3ee-2ce8f7cce75e.jpeg", caption: "Bedroom Detail" },
        { id: 10, url: "/images/9b7478c5-d702-4d7f-9678-4dd36087a2ab.jpeg", caption: "Kitchenette" },
        { id: 11, url: "/images/a1e824dc-9924-434d-9726-05ec03a4d8dc.jpeg", caption: "Entrance Hall" },
        { id: 12, url: "/images/b138811d-7a36-4836-9481-7a041c46f1df.jpeg", caption: "Backyard" },
        { id: 13, url: "/images/b32203e6-544f-4a67-8bcd-752a8f4c8086.jpeg", caption: "Balcony" },
        { id: 14, url: "/images/c0baf1f4-335a-49d4-9c73-d7dc7e0091a2.jpeg", caption: "Study Area" },
        { id: 15, url: "/images/d86926ef-9bbd-45bd-a3d7-be747f1a9049.jpeg", caption: "Guest Room" },
        { id: 16, url: "/images/da5ab261-9d15-42b0-8924-6d6cd881c83d.jpeg", caption: "Wardrobe Space" },
        { id: 17, url: "/images/ed44ece4-3c59-4134-b4ed-793c9a5fcae7.jpeg", caption: "Utility Area" },
        { id: 18, url: "/images/f76e14de-6629-4bc1-a747-51b2dc493f5d.jpg.jpeg", caption: "Side Exterior" },
        { id: 19, url: "/images/fc587ca5-b166-4888-902b-5a0ad794dc5c.jpg.jpeg", caption: "Main Gate" },
        { id: 20, url: "/images/5586fab9-f6cb-4db8-8f6b-4380c4526633.jpg.jpeg", caption: "Garden Area" },
        { id: 21, url: "/images/6681256d-d778-4cf1-81c3-3b6b2d9e656d.jpg.jpeg", caption: "Parking Space" },
        { id: 22, url: "/images/8601d2a7-77b5-410b-b9e6-114f3cab5367.jpg.jpeg", caption: "Roof Top" },
        { id: 23, url: "/images/883b293e-4e0b-4794-8af5-7225d5082c02.jpg.jpeg", caption: "Staircase" },
        { id: 24, url: "/images/98c9ce07-bce3-4729-bc20-38a89a9245e9.jpeg", caption: "Interior Decor" },
        { id: 25, url: "/images/ae42f946-6041-4746-9484-aa1322e91eaa.jpg.jpeg", caption: "Night View" },
        { id: 26, url: "/images/ac430010-7a0c-4ddb-a973-74bce661d08b.jpeg", caption: "Kitchen Counter" },
        { id: 27, url: "/images/98c9ce07-bce3-4729-bc20-38a89a9245e9_3.jpeg", caption: "Bedroom Angle" },
        { id: 28, url: "/images/ac430010-7a0c-4ddb-a973-74bce661d08b_1.jpeg", caption: "Kitchen Detail" }
    ],
    amenities: [
        { id: "ac", label: "Air conditioning", active: true, icon: "snowflake" },
        { id: "tv", label: "65-inch TV", active: true, icon: "tv" },
        { id: "kitchen", label: "Samsung & Hindware Kitchen", active: true, icon: "chef" },
        { id: "wifi", label: "High-Speed Wi-Fi", active: true, icon: "wifi" },
        { id: "parking", label: "Free Premises Parking", active: true, icon: "car" },
        { id: "safety", label: "24/7 Security Cameras", active: true, icon: "security" },
        { id: "laundry", label: "Washing Machine", active: true, icon: "laundry" },
        { id: "family", label: "Cot & Family Essentials", active: true, icon: "family" }
    ]
};

export const INITIAL_BOOKINGS = [
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

export const REVIEWS = [
    { name: "Recent Guest", location: "Global", date: "June 2026", rating: 4.8, comment: "Spacious with modern lighting. Truly feels like a home away from home. The kitchen is fully equipped and the host Mohan was very responsive." },
    { name: "Verified Stay", location: "India", date: "May 2026", rating: 5, comment: "Great location near popular attractions but still in a quiet neighborhood. Perfect for families. The 65-inch TV was a big plus!" },
    { name: "Family traveler", location: "Karnataka", date: "April 2026", rating: 5, comment: "Samruddhi lived up to its name. Prosperity and comfort in every corner. We loved the state-of-the-art interiors." }
];

// Helper to get data from localStorage or fallback to initial
export const getPropertyInfo = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_property_info');
        return saved ? JSON.parse(saved) : INITIAL_PROPERTY_INFO;
    }
    return INITIAL_PROPERTY_INFO;
};

export const getBookings = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_bookings');
        return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    }
    return INITIAL_BOOKINGS;
};

export const savePropertyInfo = (info: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_property_info', JSON.stringify(info));
    }
};

export const saveBookings = (bookings: any[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_bookings', JSON.stringify(bookings));
    }
};

