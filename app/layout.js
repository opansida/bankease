import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "BankEase",
  description: "BankEase is a budgeting app that helps you manage your finances.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}

