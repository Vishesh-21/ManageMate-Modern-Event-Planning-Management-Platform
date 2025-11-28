"use client";

import React from "react";
import { api } from "../../../../convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { HeroSection } from "./_components/hero-section";
import { FeaturedCarousel } from "./_components/featured-carousel";
import { useRouter } from "next/navigation";

const ExplorePage = () => {
  //fetch current user location
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { data: featuredEvents, loading: loadingFeaturedEvents } =
    useConvexQuery(api.events.getFeaturedEvents, { limit: 10 });

  const { data: localEvents, loading: loadingLocalEvents } = useConvexQuery(
    api.events.getEventsByLocation,
    {
      city: currentUser?.city || "Gurgaon",
      state: currentUser?.state || "Haryana",
      limit: 4,
    }
  );

  const { data: popularEvents, loading: loadingPopularEvents } = useConvexQuery(
    api.events.getPopularEvents,
    { limit: 4 }
  );

  const { data: categoryCount, loading: loadingCategoryCount } = useConvexQuery(
    api.events.getCategoryCount
  );

  //function to handle event click
  const router = useRouter();
  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  return (
    <>
      {/* hero section  */}
      <HeroSection />

      {/* featured carousel  */}
      {featuredEvents && featuredEvents.length > 0 && (
        <FeaturedCarousel
          featuredEvents={featuredEvents}
          onEventClick={handleEventClick}
        />
      )}

      {/* local events  */}

      {/* events by category  */}

      {/* popular events  */}

      {/* empty state  */}
    </>
  );
};

export default ExplorePage;
