import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import AuthProvider from "@/context/AuthContext";
import StateProvider from "@/context/StateContext";

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
      <body className={`${montserrat.className} ${lato.className} bg-white relative`}>
        <StateProvider>
          <AuthProvider>
            <StoreProvider>{children}</StoreProvider>
          </AuthProvider>
        </StateProvider>
      </body>
    </html>
  );
}
