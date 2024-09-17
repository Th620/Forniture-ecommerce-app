import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthProvider from "@/context/AuthContext";
import StateProvider from "@/context/StateContext";
import { Suspense } from "react";
import Loading from "../loading";

export default function ClientLayout({ children }) {
  return (
    <>
      <NavBar />

      <Suspense fallback={<Loading />}>
        <AuthProvider>{children}</AuthProvider>
      </Suspense>
      <Footer />
    </>
  );
}
