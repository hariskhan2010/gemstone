'use client'
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import AboutPage from "./components/about";
import FeaturedProducts from "./components/featured-products";
import Testimonials from "./components/testimonials";
import Newsletter from "./components/newsletter";
import CustomGemCollection from "./components/custom-gem-collection";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <CustomGemCollection />
      <Testimonials />
      <Newsletter />
      <AboutPage />
    </>
  );
}
