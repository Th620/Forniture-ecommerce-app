import Banner from "@/components/Banner";
import BestSellerSection from "@/components/BestSellerSection";
import CardSection from "@/components/CardSection";
import CategoriesSection from "@/components/CategoriesSection";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import ServicesSection from "@/components/ServicesSection";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <CardSection />
      <BestSellerSection />
      <Banner />
      <CategoriesSection />
      <ServicesSection />
    </main>
  );
}
