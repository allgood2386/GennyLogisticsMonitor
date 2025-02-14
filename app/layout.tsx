import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genny Cream Ale Monitor",
  description: "Monitoring application inspired by Genny Cream Ale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/a26c7e47-8642-4257-af60-71a1e46cebe4_600x600.png" />
      </head>
      <body>
        <header
          style={{
            backgroundColor: "#02311e", // Genesee green color
            color: "#ffffff", // White text color
            padding: "1rem",
            textAlign: "center",
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <h1>Genny Cream Ale Monitor</h1>
        </header>
        <main style={{ paddingTop: "4rem" }}>
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#02311e", // Genesee green color
            color: "#ffffff", // White text color
            padding: "1rem",
            textAlign: "center",
            width: "100%",
            position: "fixed",
            bottom: 0,
            left: 0,
          }}
        >
          <p>&copy; 2025 Genny Cream Ale Monitor</p>
        </footer>
      </body>
    </html>
  );
}
