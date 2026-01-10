import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/use-toast-custom";
import { HeaderStateProvider } from "@/hooks/use-header-state";

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
        <title>Spirit Beads | Handcrafted Native American Beaded Lighter Cases</title>
        <meta
          name="description"
          content="Shop unique handmade beaded lighter cases crafted by a Native American artisan. Each piece features traditional beadwork patterns. Support Indigenous-owned business."
        />
        <meta name="keywords" content="beaded lighter case, Native American beadwork, handmade lighter cover, Indigenous art, traditional crafts" />
        <link rel="canonical" href="https://sacredbeads.com" />
      </Helmet>

      <HeaderStateProvider>
        <div className="min-h-screen bg-background">
          {/* Checkout overlay for blur effect */}
          <div id="checkout-overlay" className="checkout-overlay" />
          <Header />
          <main className="pt-[100px] md:pt-[116px]">
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
      </HeaderStateProvider>
    </>
  );
};

export default Index;
