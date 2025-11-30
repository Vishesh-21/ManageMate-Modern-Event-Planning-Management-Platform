import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="md:mt-0 mt-10">
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:lg:grid-cols-2 grid-cols-1 md:mt-0 mt-24 gap-4 items-center relative z-10">
          {/* left  */}
          <div className="text-center sm:text-left">
            <span className="text-gray-500 font-light tracking-wide mb-6">
              ManageMate<span className="text-purple-400">*</span>
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-wider">
              Smarter Tools <br />
              for Seamless
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Planning
              </span>
            </h1>
            <p className="text-medium sm:text-medium text-gray-400 mb-8 max-w-lg font-light">
              ManageMate helps you plan and run events with speed and precision,
              bringing tasks, schedules, and details into one smooth,
              stress-free workspace.
            </p>

            <Link href={"/explore"}>
              <Button size="xl" className={"rounded-full cursor-pointer"}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* right */}
          <div>
            <Image
              src={"/hero-section-image.png"}
              alt="hero image"
              width={300}
              height={300}
              className="w-full h-auto scale-[1.1]"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
