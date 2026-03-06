import Hero from "../components/Hero";
import Services from "../pages/Services";
import WhyAI from "../components/WhyAI";
import Process from "../components/Process";
import CTA from "../components/CTA";
import Rcase from "../pages/Rcase"
import CaseStudies from "./CaseStudies";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyAI />
      <Services />
      <Rcase />
      <Process />
      <CTA />
    </>
  );
}