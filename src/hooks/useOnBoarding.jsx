"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConvexQuery } from "./useConvexQuery";
import { api } from "../../convex/_generated/api";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];

export function useOnBoarding() {
  const [showOnBoarding, setShowOnBoarding] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: currentUser, loading } = useConvexQuery(
    api.users.getCurrentUser
  );

  useEffect(() => {
    // still loading → do nothing
    if (currentUser === undefined || loading) return;

    // user does not exist → no onboarding to show
    if (currentUser === null) {
      setShowOnBoarding(false);
      return;
    }

    // user exists but hasn't completed onboarding
    if (!currentUser.hasCompletedOnboarding) {
      const requires = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page)
      );
      setShowOnBoarding(requires);
    } else {
      setShowOnBoarding(false);
    }
  }, [currentUser, loading, pathname]);

  const handleOnBoardingComplete = () => {
    setShowOnBoarding(false);
    router.refresh();
  };

  const handleOnBoardingSkip = () => {
    setShowOnBoarding(false);
    router.push("/");
  };

  return {
    showOnBoarding,
    handleOnBoardingComplete,
    handleOnBoardingSkip,
    setShowOnBoardBoarding: setShowOnBoarding,
    needsOnBoarding:
      currentUser && !currentUser.hasCompletedOnboarding,
  };
}
