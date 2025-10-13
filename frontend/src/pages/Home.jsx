import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import UploadSection from "../components/UploadSection";

export default function Home() {
  const uploadRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      <Navbar />
      <HeroSection onUploadClick={scrollToUpload} />
      <div ref={uploadRef}>
        <UploadSection />
      </div>
    </div>
  );
}
