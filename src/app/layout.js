import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans' 
});

export const metadata = {
  title: "MATCHN'T",
  description: "Where singles find their match",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased text-[#1A1A1A] bg-[#F5F5F5]`}>
        <div className="max-w-[480px] mx-auto bg-white min-h-screen relative shadow-2xl overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
