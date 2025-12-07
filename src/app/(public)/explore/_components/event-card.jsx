import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryIconById, getCategoryLabelById } from "@/lib/data";
import { format } from "date-fns/format";
import { QrCode } from "lucide-react";
import { Eye } from "lucide-react";
import { Calendar } from "lucide-react";
import { Users } from "lucide-react";
import { Trash2 } from "lucide-react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

const EventCard = ({
  event,
  onEventClick,
  variant = "grid",
  action = null, // "event" | "ticket" | null
  onDelete,
  className = "",
}) => {
  if (variant === "list") {
    return (
      <Card
        className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50 ${className}`}
        onClick={() => onEventClick(event.slug)}
      >
        <CardContent className={"p-3 flex gap-3"}>
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ backgroundColor: event.themeColor }}
              >
                {getCategoryIconById(event.category)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm mb-1 group-hover:text-purple-400/80 transition-colors line-clamp-2">
              {event.title}
            </h2>
            <p className="text-xs text-muted-foreground mb-1">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">
                {event.locationType === "online" ? "Online Event" : event.city}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden group pt-0 ${
        onEventClick
          ? "cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
          : ""
      } ${className}`}
      onClick={() => onEventClick(event.slug)}
    >
      {/* image  */}
      <div className="h-48 overflow-hidden relative">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="w-full h-ful object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div
            className="w-full h-full object-cover flex items-center justify-center text-4xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIconById(event.categoryId)}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={"secondary"}>
            {event?.ticketType === "paid" ? "Paid" : "Free"}
          </Badge>
        </div>
      </div>
      <CardContent className={"space-y-3"}>
        <div>
          <Badge variant={"outline"} className={"mb-2"}>
            {getCategoryIconById(event.category)}{" "}
            {getCategoryLabelById(event.category)}
          </Badge>
          <h2 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </h2>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(event.startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {action && (
          <div className="flex gap-2 pt-2">
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(e);
              }}
            >
              {action === "event" ? (
                <>
                  <Eye className="w-4 h-4" /> View
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" /> Show ticket
                </>
              )}
            </Button>

            {onDelete && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="text-red-500 hover:text-red-600 cursor-pointer hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(event._id);
                }}
              >
                {action === "event" ? (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Cancel
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
