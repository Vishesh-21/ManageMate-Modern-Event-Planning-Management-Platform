"use client";

import { UserButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/useStoreUserEffect";
import { Plus } from "lucide-react";
import { Ticket } from "lucide-react";
import { OnboardingModel } from "./onboarding-model";
import { useOnBoarding } from "@/hooks/useOnBoarding";
import SearchLocationBar from "./search-location-bar";

const Header = () => {
  const { isLoading } = useStoreUser();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { showOnBoarding, handleOnBoardingComplete, handleOnBoardingSkip } =
    useOnBoarding();
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b ">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/manage-mate-logo.png"
              alt="logo image"
              height={500}
              width={500}
              className="w-full h-11"
              priority
            />

            {/* pro badge  */}
          </Link>

          {/* search and location - desktop only  */}
          <div className="hidden md:flex justify-center flex-1">
            <SearchLocationBar />
          </div>

          {/* right side actions  */}
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              size={"sm"}
              className="cursor-pointer"
              onClick={() => setShowUpgradeModal(true)}
            >
              Pricing
            </Button>

            <Button variant={"ghost"} size={"sm"} asChild className={"mr-2"}>
              <Link href="/explore">Explore</Link>
            </Button>

            <Authenticated>
              {/* create event  */}
              <Button
                asChild
                className="flex gap-1 mr-4 font-semibold"
                size={"sm"}
              >
                <Link href="/create-event">
                  <Plus className="w-4 h-5" />
                  <span className="hidden md:inline">Create Event</span>
                </Link>
              </Button>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Ticket size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
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
        <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
        </div>

        {/* loader */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#a855f0" />
          </div>
        )}

        {/* modals  */}
        <OnboardingModel
          isOpen={showOnBoarding}
          onClose={handleOnBoardingSkip}
          onComplete={handleOnBoardingComplete}
        />
      </nav>
    </>
  );
};

export default Header;
