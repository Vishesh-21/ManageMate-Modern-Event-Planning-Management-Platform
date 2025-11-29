import { Button } from "@/components/ui/button";
import { createSlug } from "@/lib/helper";
import { ArrowRight } from "lucide-react";
import React from "react";

const LocalEvents = ({ currentUser, onEventClick }) => {
  const handelClick = () => {
    const city = currentUser?.location?.city || "Gurgaon";
    const state = currentUser?.location?.state || "Haryana";

    const slug = createSlug(city, state);

    onEventClick(slug);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1">Events Near You</h2>
          <p className="text-muted-foreground">
            Happing in {currentUser?.location?.city || "your area"}
          </p>
        </div>
        <Button
          variant={"outline"}
          className={"gap-2 cursor-pointer"}
          onClick={() => handelClick()}
        >
          View All <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LocalEvents;
