import Banner from "@/components/Banner";
import BestSellerSection from "@/components/BestSellerSection";
import CardSection from "@/components/CardSection";
import CategoriesSection from "@/components/CategoriesSection";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";

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
