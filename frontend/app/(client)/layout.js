import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthProvider from "@/context/AuthContext";
import { Suspense } from "react";
import Loading from "../loading";

export default function ClientLayout({ children }) {
  return (
    <div className="relative w-full">
      <NavBar />
      <Suspense fallback={<Loading />}>
        <AuthProvider>{children}</AuthProvider>
      </Suspense>
      <Footer />
    </div>
  );
}
