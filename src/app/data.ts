import { fbGetPropertyInfo, fbSavePropertyInfo, fbGetBookings, fbSaveBookings, fbGetFaqs, fbSaveFaqs, fbGetReviews, fbSaveReviews, fbGetWaNumber, fbSaveWaNumber } from './firebase';

// --- INITIAL DATA & SEED STATES ---

export const INITIAL_PROPERTY_INFO = {
    title: "Samruddhi",
    tagline: "Prosperity in everything you do",
    description: "Fully furnished home with state of art interiors & ambient modern lightings with spacious living area & bedrooms. Modern kitchen with all required equipment and provision to cook yourself. Perfect place for relaxed stay for two to three families. \n\nSituated in a quiet locality proximity to popular establishments and attractions. Make your stay more memorable by staying at our home to get a feel of your(dream) home.",
    guestCapacity: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    location: "Samruddhi Homestay, Landlinks Layout, 13/1, Samruddhi 1st Cross, 1-S-28-2346/13, Hoigebail Rd, near Skate City, Hoige Bail, Ashok Nagar, Mangaluru, Karnataka 575006",
    mapUrl: "https://maps.app.goo.gl/p3va2P2E3joWHTK39",
    nearbyPlaces: [
        { name: "Francis Doris Skate City", description: "International standard skating rink and entertainment center just steps from the homestay.", mapLink: "https://maps.app.goo.gl/jne1yHwhVBMPQ1k77" },
        { name: "City Centre Mall", description: "Popular shopping and dining destination in Hampankatta.", mapLink: "https://maps.app.goo.gl/aRBQTLwZURGuGHRo8" },
        { name: "Panambur Beach", description: "Scenic beachfront ideal for evening walks and sunsets.", mapLink: "https://www.google.com/maps/place/Panambur+Beach/@12.937222,74.804167,17z" },
        { name: "Kudroli Gokarnanatha Temple", description: "Famous temple known for its stunning architecture.", mapLink: "https://maps.app.goo.gl/Pqm3Wb7jRb6jq6S5A" }
    ],
    pricePerNight: 2000,
    airbnbUrl: "https://www.airbnb.com/rooms/53178588",
    hostName: "Mohan Nagesh Shenoy",
    hostEmail: "mohan@samruddhi.com",

    images: [
        { id: 1, url: "/images/2c781291-fff0-4385-b1cf-4f9bf1fc01cf.jpg.jpeg", caption: "" },
        { id: 2, url: "/images/1fd428c9-8729-420a-be13-6f9d357eeea2.jpg.jpeg", caption: "" },
        { id: 3, url: "/images/00f6fa1b-f20b-46f4-9e50-b495a9e7c4d8.jpg.jpeg", caption: "" },
        { id: 4, url: "/images/2d132371-d86d-43b0-8349-f769ee45b909.jpeg", caption: "" },
        { id: 5, url: "/images/43b049f7-646d-4426-bbad-59057e92f2ef.jpeg", caption: "" },
        { id: 6, url: "/images/0f952b75-b02a-40fc-aee8-78ead811a7dd.jpeg", caption: "" },
        { id: 7, url: "/images/607c8a98-f957-45ec-85b4-dee194d75b3d.jpeg", caption: "" },
        { id: 8, url: "/images/66c0a3a3-115c-42d6-b6fb-c892bd98e2a9.jpeg", caption: "" },
        { id: 9, url: "/images/8a49bfdd-4c21-46ae-b3ee-2ce8f7cce75e.jpeg", caption: "" },
        { id: 10, url: "/images/9b7478c5-d702-4d7f-9678-4dd36087a2ab.jpeg", caption: "" },
        { id: 11, url: "/images/a1e824dc-9924-434d-9726-05ec03a4d8dc.jpeg", caption: "" },
        { id: 12, url: "/images/b138811d-7a36-4836-9481-7a041c46f1df.jpeg", caption: "" },
        { id: 13, url: "/images/b32203e6-544f-4a67-8bcd-752a8f4c8086.jpeg", caption: "" },
        { id: 14, url: "/images/c0baf1f4-335a-49d4-9c73-d7dc7e0091a2.jpeg", caption: "" },
        { id: 15, url: "/images/d86926ef-9bbd-45bd-a3d7-be747f1a9049.jpeg", caption: "" },
        { id: 16, url: "/images/da5ab261-9d15-42b0-8924-6d6cd881c83d.jpeg", caption: "" },
        { id: 17, url: "/images/ed44ece4-3c59-4134-b4ed-793c9a5fcae7.jpeg", caption: "" },
        { id: 18, url: "/images/f76e14de-6629-4bc1-a747-51b2dc493f5d.jpg.jpeg", caption: "" },
        { id: 19, url: "/images/fc587ca5-b166-4888-902b-5a0ad794dc5c.jpg.jpeg", caption: "" },
        { id: 20, url: "/images/5586fab9-f6cb-4db8-8f6b-4380c4526633.jpg.jpeg", caption: "" },
        { id: 21, url: "/images/6681256d-d778-4cf1-81c3-3b6b2d9e656d.jpg.jpeg", caption: "" },
        { id: 22, url: "/images/8601d2a7-77b5-410b-b9e6-114f3cab5367.jpg.jpeg", caption: "" },
        { id: 23, url: "/images/883b293e-4e0b-4794-8af5-7225d5082c02.jpg.jpeg", caption: "" },
        { id: 24, url: "/images/98c9ce07-bce3-4729-bc20-38a89a9245e9.jpeg", caption: "" },
        { id: 25, url: "/images/ae42f946-6041-4746-9484-aa1322e91eaa.jpg.jpeg", caption: "" },
        { id: 26, url: "/images/ac430010-7a0c-4ddb-a973-74bce661d08b.jpeg", caption: "" },
        { id: 27, url: "/images/98c9ce07-bce3-4729-bc20-38a89a9245e9_3.jpeg", caption: "" },
        { id: 28, url: "/images/ac430010-7a0c-4ddb-a973-74bce661d08b_1.jpeg", caption: "" }
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
    {
        name: "Srikumar",
        location: "Bangalore, India",
        date: "December 2024",
        rating: 5,
        comment: "The property is very well maintained and is very close to the city. The host is very responsive and helpful. The place is very spacious and has all the amenities. We had a great stay. Highly recommend."
    },
    {
        name: "Bharath",
        location: "Mangalore, India",
        date: "November 2024",
        rating: 5,
        comment: "Very nice and spacious home. Kitchen is fully equipped. Host was very responsive and helpful. Kids loved the space. Will definitely come back again."
    },
    {
        name: "Tejas",
        location: "Pune, India",
        date: "October 2024",
        rating: 5,
        comment: "Amazing stay! The house is beautifully furnished and very clean. The host Mr. Mohan was very helpful and responsive. Everything was as described. Perfect for a family trip."
    },
    {
        name: "Namitha",
        location: "Mysore, India",
        date: "September 2024",
        rating: 5,
        comment: "Wonderful place to stay. Very clean, spacious and well-equipped. The location is quite good - close to major areas. Host was cooperative and always available. Highly recommended!"
    },
    {
        name: "Ravi Kumar",
        location: "Chennai, India",
        date: "August 2024",
        rating: 5,
        comment: "Superb experience! The house is exactly as shown in the photos. The host Mohan is a superhost for a reason - very professional and caring. Loved the modern interiors."
    },
    {
        name: "Pradeep",
        location: "Hyderabad, India",
        date: "July 2024",
        rating: 5,
        comment: "Ideal for family vacations. Very spacious with two good bedrooms, excellent kitchen with all necessary equipment. The 65 inch TV was a bonus. Great value for money."
    },
    {
        name: "Sneha",
        location: "Mumbai, India",
        date: "June 2024",
        rating: 5,
        comment: "Beautiful home in a peaceful locality. Everything was clean and in order. Mr. Mohan was extremely helpful and made us feel very welcome. Would definitely stay again!"
    },
    {
        name: "Kiran",
        location: "Kerala, India",
        date: "May 2024",
        rating: 4,
        comment: "Nice and comfortable stay. The house has good facilities. Host is responsive. Location is decent. Good choice for families."
    },
    {
        name: "Ananya",
        location: "Delhi, India",
        date: "April 2024",
        rating: 5,
        comment: "Exceptional stay! The place is well-furnished and very spacious. Kids loved the large space to play indoors. Host communicated well and made check-in seamless."
    },
    {
        name: "Manoj",
        location: "Bangalore, India",
        date: "March 2024",
        rating: 5,
        comment: "This is the best Airbnb I have stayed in Mangalore. Very clean, spacious and all amenities you need for a comfortable stay. Host is excellent. Five stars!"
    },
    {
        name: "Divya",
        location: "Udupi, India",
        date: "February 2024",
        rating: 5,
        comment: "Very comfortable and homely atmosphere. The property is well maintained and has everything one needs. The host is warm and extremely helpful. Strongly recommend!"
    },
    {
        name: "Arun",
        location: "Mangalore, India",
        date: "January 2024",
        rating: 5,
        comment: "Great place! Neat and clean. Good facilities - AC, geyser, fully equipped kitchen. The host Mohan is very professional and quick to respond. Would book again!"
    }
];

export const INITIAL_FAQS = [
    { q: "What are the check-in / check-out timings?", a: "Check-in is from 1:00 PM onward, and check-out is by 11:00 AM. Early check-in or late check-out can be arranged on request." },
    { q: "Is the entire property private for guests?", a: "Yes, the entire home is exclusively yours during your stay. No shared spaces." },
    { q: "Is parking available?", a: "Free on-premises parking is available for up to 2 cars." },
    { q: "Is the kitchen fully equipped?", a: "Yes, the kitchen features Samsung & Hindware appliances, cookware, utensils, and a refrigerator. Just bring your ingredients!" },
    { q: "Is Wi-Fi included?", a: "Yes, high-speed Wi-Fi is available throughout the property at no extra cost." },
    { q: "Are pets allowed?", a: "Small, well-behaved pets are allowed with prior intimation. Please inform us at the time of booking." },
    { q: "What is the cancellation policy?", a: "Free cancellation up to 5 days before check-in. 50% refund between 2–5 days. No refund within 48 hours of check-in." },
    { q: "How do I access the property?", a: "We provide self-check-in via a secure keybox. The code will be shared on the morning of your check-in." },
];

export const WA_NUMBER = "919876543210";

export const getPropertyInfo = async () => {
    try {
        const fb = await fbGetPropertyInfo();
        if (fb !== INITIAL_PROPERTY_INFO) return fb;
    } catch {}
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_property_info');
        if (saved) return JSON.parse(saved);
    }
    return INITIAL_PROPERTY_INFO;
};

export const getBookings = async () => {
    try {
        const fb = await fbGetBookings();
        if (fb.length > 0) return fb;
    } catch {}
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_bookings');
        if (saved) return JSON.parse(saved);
    }
    return INITIAL_BOOKINGS;
};

export const getFaqs = async () => {
    try {
        const fb = await fbGetFaqs();
        if (fb.length > 0) return fb;
    } catch {}
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_faqs');
        if (saved) return JSON.parse(saved);
    }
    return INITIAL_FAQS;
};

export const getReviews = async () => {
    try {
        const fb = await fbGetReviews();
        if (fb.length > 0) return fb;
    } catch {}
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('samruddhi_reviews');
        if (saved) return JSON.parse(saved);
    }
    return REVIEWS;
};

export const getWaNumber = async () => {
    try {
        const fb = await fbGetWaNumber();
        if (fb) return fb;
    } catch {}
    if (typeof window !== 'undefined') {
        const ls = localStorage.getItem('samruddhi_wa_number');
        if (ls) return ls;
    }
    return WA_NUMBER;
};

export const savePropertyInfo = async (info: any) => {
    try { await fbSavePropertyInfo(info); } catch {}
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_property_info', JSON.stringify(info));
    }
};

export const saveBookings = async (bookings: any[]) => {
    try { await fbSaveBookings(bookings); } catch {}
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_bookings', JSON.stringify(bookings));
    }
};

export const saveFaqs = async (faqs: any[]) => {
    try { await fbSaveFaqs(faqs); } catch {}
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_faqs', JSON.stringify(faqs));
    }
};

export const saveReviews = async (reviews: any[]) => {
    try { await fbSaveReviews(reviews); } catch {}
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_reviews', JSON.stringify(reviews));
    }
};

export const saveWaNumber = async (num: string) => {
    try { await fbSaveWaNumber(num); } catch {}
    if (typeof window !== 'undefined') {
        localStorage.setItem('samruddhi_wa_number', num);
    }
};

