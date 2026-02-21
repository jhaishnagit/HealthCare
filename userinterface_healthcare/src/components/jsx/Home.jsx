import React from "react";
import Navbar from "../navbar/Navbar";
import Hero from "../jsx/Hero";
import ServicesGrid from "../jsx/ServicesGrid";
import ConsultationBanner from "../jsx/ConsultationBanner";
import SpecialisedDoctors from "../jsx/SpecialisedDoctors";
import CashlessSupport from "../jsx/CashlessSupport";
import VideosSection from "../jsx/VideosSection";
import Chatbot from "../jsx/Chatbot";
import RoboAssistant from "../jsx/RoboAssistant";
import Footer from "../jsx/Footer";
import "../../components/style/home.css";

function Home() {
  return (
    <div className="home-wrapper">   {/* 🔥 NEW WRAPPER */}
      <Navbar />
      <main className="main-content">
        <Hero />
        <div className="container">
          <ServicesGrid />
          <ConsultationBanner />
          <SpecialisedDoctors />
          <CashlessSupport />
          <VideosSection />   
           <Footer />
        </div>
      </main>

      {/* Fixed elements can stay outside container */}
      <Chatbot />
      <RoboAssistant />
    </div>
  );
}

export default Home;