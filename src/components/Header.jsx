import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/iimmmage-removebg-preview.png"
              alt="logo image"
              height={500}
              width={500}
              className="w-full h-11"
              priority
            />

            {/* pro badge  */}
          </Link>

          {/* search and location - desktop only  */}

          {/* right side actions  */}
        </div>
      </nav>
    </>
  );
};

export default Header;
