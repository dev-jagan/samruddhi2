"use client";
import React from 'react';

// ==========================================
// --- INTERACTIVE AV_CALENDAR COMPONENT ---
// ==========================================
export function CalendarGrid({
    bookings,
    currentCalDate,
    setCurrentCalDate,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    showToast
}: any) {
    const year = currentCalDate.getFullYear();
    const monthIdx = currentCalDate.getMonth(); // 0-based index

    // Month metadata
    const monthName = currentCalDate.toLocaleString('default', { month: 'long' });
    const firstDayIndex = new Date(year, monthIdx, 1).getDay(); // Sunday=0, Monday=1, ...
    const totalDaysInMonth = new Date(year, monthIdx + 1, 0).getDate();

    // Date helper string builder: e.g., '2026-06-05'
    const getDateString = (dayNum: number) => {
        const formattedMonth = String(monthIdx + 1).padStart(2, '0');
        const formattedDay = String(dayNum).padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    // Check state of individual dates
    const getDateStatus = (dayNum: number) => {
        const dateStr = getDateString(dayNum);
        const matchedRecord = bookings.find((b: any) => b.date === dateStr);
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
    const handleCellClick = (dayNum: number) => {
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
                    const checkStatus = bookings.find((b: any) => b.date === dateStringCheck)?.status;
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
    const dayCells: any[] = [];
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
export function getAmenityIcon(iconName: string) {
    switch (iconName) {
        case "snowflake":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case "tv":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V20M17 4V20M3 8H21M3 16H21" />
                </svg>
            );
        case "chef":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            );
        case "wifi":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.14 0M1.398 6.505a16.5 16.5 0 0121.204 0" />
                </svg>
            );
        case "car":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            );
        case "security":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        case "laundry":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case "family":
            return (
                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
