import "./globals.css";

export const metadata = {
  title: "Jacob's Distributor",
  description: "Modern music distribution platform demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}