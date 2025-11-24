"use client";

import { UserButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/useStoreUserEffect";

const Header = () => {
  const { isLoading } = useStoreUser();
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b ">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
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
          <div className="flex items-center">
            <Authenticated>
              {/* create event  */}
              <UserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* mobile search and locations - below header  */}

        {/* loader */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#a855f0" />
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
