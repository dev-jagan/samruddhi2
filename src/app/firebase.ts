import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { INITIAL_PROPERTY_INFO, INITIAL_BOOKINGS, REVIEWS, INITIAL_FAQS, WA_NUMBER } from "./data";

const firebaseConfig = {
  apiKey: "AIzaSyBibdL0D6tmfCarcbc0CTnFESZZv_g6c84",
  authDomain: "help-seekers.firebaseapp.com",
  projectId: "help-seekers",
  storageBucket: "help-seekers.firebasestorage.app",
  messagingSenderId: "355725757975",
  appId: "1:355725757975:web:8fb47987e00ca8d9d89652",
  measurementId: "G-QFZRT1QHJG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function fbGetPropertyInfo() {
  try {
    const snap = await getDoc(doc(db, "property_info", "main"));
    if (snap.exists()) return snap.data();
  } catch (e) { console.warn("Firebase read error (property_info):", e); }
  return INITIAL_PROPERTY_INFO;
}

export async function fbSavePropertyInfo(info: any) {
  try {
    await setDoc(doc(db, "property_info", "main"), info);
    return true;
  } catch (e) { console.warn("Firebase write error (property_info):", e); return false; }
}

export async function fbGetBookings() {
  try {
    const snap = await getDoc(doc(db, "bookings", "data"));
    if (snap.exists()) return snap.data().list || [];
  } catch (e) { console.warn("Firebase read error (bookings):", e); }
  return INITIAL_BOOKINGS;
}

export async function fbSaveBookings(list: any[]) {
  try {
    await setDoc(doc(db, "bookings", "data"), { list });
    return true;
  } catch (e) { console.warn("Firebase write error (bookings):", e); return false; }
}

export async function fbGetReviews() {
  try {
    const snap = await getDoc(doc(db, "reviews", "data"));
    if (snap.exists()) return snap.data().list || [];
  } catch (e) { console.warn("Firebase read error (reviews):", e); }
  return REVIEWS;
}

export async function fbSaveReviews(list: any[]) {
  try {
    await setDoc(doc(db, "reviews", "data"), { list });
    return true;
  } catch (e) { console.warn("Firebase write error (reviews):", e); return false; }
}

export async function fbGetFaqs() {
  try {
    const snap = await getDoc(doc(db, "faqs", "data"));
    if (snap.exists()) return snap.data().list || [];
  } catch (e) { console.warn("Firebase read error (faqs):", e); }
  return INITIAL_FAQS;
}

export async function fbSaveFaqs(list: any[]) {
  try {
    await setDoc(doc(db, "faqs", "data"), { list });
    return true;
  } catch (e) { console.warn("Firebase write error (faqs):", e); return false; }
}

export async function fbGetWaNumber() {
  try {
    const snap = await getDoc(doc(db, "settings", "wa_number"));
    if (snap.exists()) return snap.data().value || WA_NUMBER;
  } catch (e) { console.warn("Firebase read error (wa_number):", e); }
  return WA_NUMBER;
}

export async function fbSaveWaNumber(value: string) {
  try {
    await setDoc(doc(db, "settings", "wa_number"), { value });
    return true;
  } catch (e) { console.warn("Firebase write error (wa_number):", e); return false; }
}
