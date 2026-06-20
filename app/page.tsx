import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CardShowcase from "@/components/home/CardShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import Stats from "@/components/home/Stats";
import Roadmap from "@/components/home/Roadmap";
import FAQ from "@/components/home/FAQ";
import Community from "@/components/home/Community";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <CardShowcase />
      <HowItWorks />
      <Stats />
      <Roadmap />
      <FAQ />
      <Community />
      <Footer />
    </main>
  );
}