import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petgo | Su comida favorita, directo a tu puerta",
  description: "Alimento para perros con delivery y seguimiento personalizado.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
