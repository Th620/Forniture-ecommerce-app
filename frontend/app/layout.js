import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { StoreProvider } from "./StoreProvider";
import Providers from "./Providers";

export const metadata = {
  title: "DECO: Modern Forniture",
  description:
    "Elevate your living space with our handpicked furniture collection",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className={`${montserrat.className} ${lato.className} bg-white`}>
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
