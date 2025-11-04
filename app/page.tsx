'use client'
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import AboutPage from "./components/about";
import OrderPage from "./components/order";
import FeaturedProducts from "./components/featured-products";
import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
      <AboutPage />
      <OrderPage />
    </>
  );
}
