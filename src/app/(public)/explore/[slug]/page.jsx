"use client";
import { useConvexQuery } from "@/hooks/useConvexQuery";
import { CATEGORIES } from "@/lib/data";
import { parsedLocationSlug } from "@/lib/helper";
import { notFound, useParams, useRouter } from "next/navigation";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { Loader } from "lucide-react";
import EventCard from "../_components/event-card";

const DynamicExplorePage = () => {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug;

  //check if it's a valid category or not
  const categoryInfo = CATEGORIES.find((category) => category.id === slug);
  const isValidCategory = !!categoryInfo;

  //if not a valid category, then we need to validate the location
  const { city, state, isValid } = isValidCategory
    ? { city: null, state: null, isValid: true }
    : parsedLocationSlug(slug);

  //if not a valid category and not a valid location, then not found
  if (!isValidCategory && !isValid) {
    notFound();
  }

  const { data: events, loading } = useConvexQuery(
    isValidCategory
      ? api.events.getEventsByCategory
      : api.events.getEventsByLocation,
    isValidCategory
      ? { category: slug, limit: 50 }
      : city && state
      ? { city, state, limit: 50 }
      : "skip"
  );

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-300  animate-spin " />
      </div>
    );
  }

  if (isValidCategory) {
    return (
      <div className="pb-5">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-6xl font-bold">{categoryInfo.icon}</h2>
          <div>
            <h3 className="text-5xl md:text-6xl font-bold">
              {categoryInfo.label}
            </h3>
            <p className="text-muted-foreground mt-2 text-lg">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        {events && events.length > 0 && (
          <p className="text-muted-foreground">
            {events.length} Event{events.length > 1 && "s"} Found
          </p>
        )}

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEventClick={handleEventClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center flex-col justify-center mt-24">
            <h1 className="text-muted-foreground/50 text-6xl font-bold">
              No events found
            </h1>
            <p className="text-muted-foreground/30">
              No events found for this category
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-6xl font-bold">📍</h2>
        <div>
          <h3 className="text-5xl md:text-6xl font-bold">Events in {city}</h3>
          <p className="text-muted-foreground mt-2 text-lg">{state}. India</p>
        </div>
      </div>

      {events && events.length > 0 && (
        <p className="text-muted-foreground">
          {events.length} Event{events.length > 1 && "s"} Found
        </p>
      )}

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center flex-col justify-center mt-24">
          <h1 className="text-muted-foreground/50 text-6xl font-bold">
            No events found
          </h1>
          <p className="text-muted-foreground/30">
            No events found in this location
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicExplorePage;
