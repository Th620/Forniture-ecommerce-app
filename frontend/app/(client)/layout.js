import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
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
