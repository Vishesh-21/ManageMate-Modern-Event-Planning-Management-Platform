import React from "react";

export const HeroSection = () => {
  return (
    <div className="pb-12 text-center my-24">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Events</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Explore featured events, find what&apos;s happening locally, or browse
        events round the world.{" "}
        <span className=" bg-linear-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent text-xl font-semibold">ManageMate</span>{" "}
        is here to help you plan and run
      </p>
    </div>
  );
};
