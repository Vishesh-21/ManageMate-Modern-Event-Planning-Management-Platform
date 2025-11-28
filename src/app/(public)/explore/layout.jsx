"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ExploreLayoutPage = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isMainExplorePage = pathname === "/explore";

  return (
    <div className="pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {!isMainExplorePage && (
          <div className="mb-6">
            <Button
              className="gap-2 -ml-6 cursor-pointer"
              variant={"ghost"}
              onClick={() => router.push("/explore")}
            >
              <ArrowLeft />
              Back to explore
            </Button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default ExploreLayoutPage;
