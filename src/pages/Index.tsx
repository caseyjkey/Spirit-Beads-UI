import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import Header from "@/components/Header";
import ShippingBanner from "@/components/ShippingBanner";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/use-toast-custom";

const Index = () => {
  const { isVisible, message, toastKey, hideToast, register, unregister } = useToast();

  useEffect(() => {
    register();
    return () => {
      unregister();
    };
  }, [register, unregister]);

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
        {/* Checkout overlay for blur effect */}
        <div id="checkout-overlay" className="checkout-overlay" />
        <ShippingBanner />
        <Header />
        <main>
          <Hero />
          <ProductGrid />
          <AboutSection />
        </main>
        <Footer />
        
        {/* Global Toast */}
        <Toast 
          message={message} 
          isVisible={isVisible} 
          toastKey={toastKey}
          onDismiss={hideToast}
        />
      </div>
    </>
  );
};

export default Index;
