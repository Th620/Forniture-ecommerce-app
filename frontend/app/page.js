import Banner from "@/components/Banner";
import BestSellerSection from "@/components/BestSellerSection";
import CardSection from "@/components/CardSection";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import SearchClient from "@/components/SearchClient";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <CardSection />
      <BestSellerSection />
      <Banner />
      <CategoriesSection />
      <ServicesSection />
      <Footer />
    </>
  );
}
