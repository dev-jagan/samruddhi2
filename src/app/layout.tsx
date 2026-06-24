import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samruddhi | Luxury Vacation Rental in Mangaluru",
  description: "Fully furnished luxury home in Landlinks Layout, Ashok Nagar, Mangaluru. Spacious 2-bedroom stay with modern amenities, AC, 65-inch TV, fully equipped kitchen and more. Book on Airbnb or WhatsApp for enquiries.",
  keywords: "Samruddhi, vacation rental, Mangaluru, Airbnb, luxury stay, family home",
  openGraph: {
    title: "Samruddhi - Prosperity in everything you do",
    description: "A beautiful private home in Mangaluru with modern amenities. Book your stay today!",
    images: ["/images/2c781291-fff0-4385-b1cf-4f9bf1fc01cf.jpg.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
