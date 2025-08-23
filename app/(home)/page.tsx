import HeroSection from "@/components/HeroSection";
import React from "react";

const HomePage = () => {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <HeroSection totalForms={0} isSubscribed={false} />
    </div>
  );
};

export default HomePage;
