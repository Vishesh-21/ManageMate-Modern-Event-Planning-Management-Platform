"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { Progress } from "./ui/progress";
import { Heart } from "lucide-react";
import { MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { api } from "../../convex/_generated/api";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { City, State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { ArrowLeft } from "lucide-react";

export function OnboardingModel({ isOpen, onClose, onComplete }) {
  // states to manage onboarding
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India",
  });

  // calculate progress
  const progress = (step / 2) * 100;

  // convex mutations
  const { mutate: completeOnBoarding, loading } = useConvexMutation(
    api.users.completeOnBoarding
  );

  // get indian states
  const indianStates = State.getStatesOfCountry("IN");

  // get cities
  const cities = useMemo(() => {
    if (!location.state) return [];
    const selectedState = indianStates.find(
      (state) => state.name === location.state
    );

    if (!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode);
  }, [location.state, indianStates]);

  // toggle interest
  function toggleInterest(id) {
    setSelectedInterest((prev) => {
      if (prev.includes(id)) {
        return prev.filter((interest) => interest !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  // handle complete to create user onboarding and close modal
  const handleComplete = async () => {
    try {
      await completeOnBoarding({
        location: {
          city: location.city,
          state: location.state,
          country: location.country,
        },
        interests: selectedInterest,
      });
      toast.success("Onboarding completed successfully🎉.");
      onComplete();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  // handle next
  const handleNext = () => {
    if (step === 1 && selectedInterest.length < 3) {
      toast.error("Please select at least 3 interests.");
      return;
    }

    if (step === 2 && (!location.city || !location.state)) {
      toast.error("Please select a location.");
      return;
    }

    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-8">
        <DialogHeader>
          {/* progress bar */}
          <div className="mb-4">
            <Progress value={progress} className={"h-1"} />
          </div>

          {/* dialog title */}
          <DialogTitle className={"flex items-center gap-2 text-2xl"}>
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" /> What interest you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" /> Where are you
                located?
              </>
            )}
          </DialogTitle>

          {/* dialog description */}
          <DialogDescription>
            {step === 1
              ? "Select at least 3 categories to personalize your experience."
              : "We'll show you events near you. You can change this later."}
          </DialogDescription>
        </DialogHeader>

        {/* dialog body to manage onboarding */}
        <div className="py-4">
          {/* UI GOES HERE according to steps */}

          {/* step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                id="interests"
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto px-2 py-4"
              >
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-4 rounded-lg border-[1px] transition-all group cursor-pointer hover:scale-105 ${
                      selectedInterest.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-purple-500/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-120 transition-all">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {category.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterest.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterest.length} Selected
                </Badge>
                {selectedInterest.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to continue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* indian states */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={location.state}
                    onValueChange={(value) => {
                      setLocation((prev) => ({
                        ...prev,
                        state: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-11 w-full" id="state">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>States</SelectLabel>
                        {indianStates.map((state) => (
                          <SelectItem key={state.isoCode} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* indian cities of selected state */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={location.city}
                    onValueChange={(value) => {
                      setLocation((prev) => ({
                        ...prev,
                        city: value,
                      }));
                    }}
                    disabled={!location.state}
                  >
                    <SelectTrigger className="h-11 w-full" id="city">
                      <SelectValue
                        placeholder={
                          location.state
                            ? "Select a city"
                            : "Select a state first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Cities</SelectLabel>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {location.city && location.state && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-purple-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Location
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {location.city}, {location.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer to navigate between steps */}
        <DialogFooter className={"flex gap-3"}>
          {/* back button  */}
          {step > 1 && (
            <Button
              className={"cursor-pointer flex-1"}
              variant={"outline"}
              onClick={() => setStep((prev) => prev - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          {/* next button or complete button */}
          <Button
            className={"cursor-pointer flex-1"}
            disabled={loading}
            onClick={handleNext}
          >
            {loading
              ? "Completing..."
              : step === 2
              ? "Complete Setup"
              : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
