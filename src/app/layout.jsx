import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "@next/font/google";
import Header from "@/components/Header";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "Manage Mate",
  description: "Discover and create amazing events.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: dark,
            }}
          >
            <ConvexClientProvider>
              {/* header  */}
              <Header />

              <main className="min-h-screen relative container mx-auto pt-16 md:pt-24 md:px-6 px-2">
                {/* glow effect  */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />

                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 min-h-[90vh]">{children}</div>

                {/* footer  */}
                <footer className="border-t border-gray-800/50 py-8 px-6 max-w-7xl mx-auto">
                  <div className="text-sm text-gray-400 text-center">
                    &copy; {new Date().getFullYear()} Manage Mate Inc. | All
                    rights reserved
                  </div>
                </footer>
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
