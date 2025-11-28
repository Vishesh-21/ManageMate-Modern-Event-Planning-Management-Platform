import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { Users } from "lucide-react";

export const FeaturedCarousel = ({ featuredEvents, onEventClick }) => {
  const plugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
    })
  );

  return (
    <div className="mb-16 ">
      <Carousel
        className="max-w-7xl mx-auto"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {featuredEvents.map((event) => (
            <CarouselItem key={event._id}>
              <div
                onClick={() => onEventClick(event.slug)}
                className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
              >
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: event.themeColor }}
                  ></div>
                )}

                <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30"></div>

                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <Badge className="w-fit mb-4" variant={"secondary"}>
                    {event.city}, {event.state || event.country}
                  </Badge>

                  <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">
                    {event.title}
                  </h1>

                  <p className="text-md text-white/90 mb-4 max-w-2xl line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex item-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {format(event.startDate, "PP")}
                      </span>
                    </div>

                    <div className="flex item-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {event.city}, {event.state || event.country}
                      </span>
                    </div>

                    <div className="flex item-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {event.registrationCount} registered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};
