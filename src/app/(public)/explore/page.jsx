"use client";

import React from "react";
import { api } from "../../../../convex/_generated/api";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { HeroSection } from "./_components/hero-section";
import { FeaturedCarousel } from "./_components/featured-carousel";
import { useRouter } from "next/navigation";
import LocalEvents from "./_components/local-events";
import { Loader } from "lucide-react";
import EventCard from "./_components/event-card";
import { CATEGORIES } from "@/lib/data";
import CategoryCard from "./_components/category-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    { limit: 8 }
  );

  const { data: categoryCount, loading: loadingCategoryCount } = useConvexQuery(
    api.events.getCategoryCount
  );

  const categoriesWithCount = CATEGORIES.map((category) => {
    return {
      ...category,
      count: categoryCount?.[category.id] || 0,
    };
  });

  //function to handle event click
  const router = useRouter();
  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const isLoading =
    loadingFeaturedEvents ||
    loadingLocalEvents ||
    loadingPopularEvents ||
    loadingCategoryCount;

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-300  animate-spin " />
      </div>
    );
  }

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
      {localEvents && localEvents.length > 0 && (
        <>
          <LocalEvents
            currentUser={currentUser}
            router={router}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="grid"
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        </>
      )}

      {/* events by category  */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Browse Events by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categoriesWithCount.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* popular events  */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="mb-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">Popular Events</h2>
            <p className="text-muted-foreground">
              Trending events around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="list"
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* empty state  */}
      {!loadingFeaturedEvents &&
        !loadingLocalEvents &&
        !loadingPopularEvents &&
        !loadingCategoryCount &&
        (!featuredEvents || featuredEvents.length === 0) &&
        (!localEvents || localEvents.length === 0) &&
        (!popularEvents || popularEvents.length === 0) && (
          <Card className={"p-12 text-center"}>
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold">No events yet</h2>
              <p className="text-muted-foreground">
                Get started by creating your first event on Manage Mate
              </p>
              <Button asChild className={"gap-2"}>
                <a href="/create-event">Create Event</a>
              </Button>
            </div>
          </Card>
        )}
    </>
  );
};

export default ExplorePage;
