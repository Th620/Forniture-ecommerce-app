import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthProvider from "@/context/AuthContext";
import StateProvider from "@/context/StateContext";
import { Suspense } from "react";

export default function ClientLayout({ children }) {
  return (
    <>
      <NavBar />
      <Suspense>{children}</Suspense>
      <Footer />
    </>
  );
}
