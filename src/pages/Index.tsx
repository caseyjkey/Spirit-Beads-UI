import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Sacred Beads | Handcrafted Native American Beaded Lighter Cases</title>
        <meta
          name="description"
          content="Shop unique handmade beaded lighter cases crafted by a Native American artisan. Each piece features traditional beadwork patterns. Support Indigenous-owned business."
        />
        <meta name="keywords" content="beaded lighter case, Native American beadwork, handmade lighter cover, Indigenous art, traditional crafts" />
        <link rel="canonical" href="https://sacredbeads.com" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <ProductGrid />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
