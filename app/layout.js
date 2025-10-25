import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Splitely",
  description: "The smartest way to split expenses with friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='8' fill='%2310B981'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='18' font-weight='bold' text-anchor='middle' fill='white'%3ES%3C/text%3E%3C/svg%3E" />
        <link rel="shortcut icon" href="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='8' fill='%2310B981'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='18' font-weight='bold' text-anchor='middle' fill='white'%3ES%3C/text%3E%3C/svg%3E" />
      </head>
      <body className={`${inter.className}`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ConvexClientProvider>
            <Header />
            <main className="min-h-screen">
              <Toaster richColors />

              {children}
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
