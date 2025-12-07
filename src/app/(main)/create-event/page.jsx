"use client";

import { useConvexQuery } from "@/hooks/useConvexQuery";
import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/lib/event-schema";
import { useRouter } from "next/navigation";
import { colorPresetsFunction, combineDateAndTime } from "@/lib/helper";
import { City, State } from "country-state-city";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { UpgradeModal } from "@/components/upgrade-modal";
import UnsplashImagePicker from "./_components/unsplash-image-picker";
import { format } from "date-fns";

const CreateEventPage = () => {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit"); //"limit", "color"

  //check if the user has pro plan or not
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, loading: isLoading } = useConvexMutation(
    api.events.createEvent
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: [],
      startTime: "",
      endTime: "",
      locationType: "physical",
      capacity: 50,
      ticketPrice: 0,
      ticketType: "free",
      themeColor: "#1e3a8a",
    },
  });

  const themeColor = watch("themeColor");
  const coverImage = watch("coverImage");
  const endDate = watch("endDate");
  const startDate = watch("startDate");
  const selectedState = watch("state");
  const ticketType = watch("ticketType");

  //all color presets
  const colorPresets = useMemo(() => colorPresetsFunction(hasPro), [hasPro]);

  //get all the states
  const indianStates = useMemo(() => State.getAllStates("IN"), []);

  //get all the cities based on selected state
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const state = indianStates.find((state) => state.name === selectedState);

    if (!state) return [];
    return City.getCitiesOfState("IN", state.isoCode);
  }, [selectedState, indianStates]);

  const handleColorClick = (color) => {
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };

  //on form submit
  const onSubmit = async (data) => {
    try {
      const start = combineDateAndTime(data.startDate, data.startTime);
      const end = combineDateAndTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Select start or end date/time");
        return;
      }

      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time");
        return;
      }

      if (!hasPro && (currentUser?.freeEventsCount || 0) >= 10) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city,
        state: data.state || undefined,
        Country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
      });

      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event!");
    }
  };

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen transition-colors duration-300 px-6 py-8 -mt-6 md:-mt-6 "
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-5 md:flex-row justify-between mb-6">
        {/* title and ai generated functionality */}
        <div>
          <h1 className="text-4xl font-bold">Create Event</h1>
          {!hasPro && (
            <p className="text-sm text-yellow-500 mt-1">
              Free : {currentUser?.freeEventsCount || 0} / 10 events created
            </p>
          )}
        </div>

        {/* future ai generated functionality  */}
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-[320px_1fr] gap-10">
        {/*left : image and theme selector  */}
        <div className="space-y-6">
          <div
            className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border"
            onClick={() => {
              setShowImagePicker(true);
            }}
          >
            {coverImage ? (
              <Image
                src={coverImage}
                className="w-full h-full object-cover"
                width={500}
                height={500}
                alt="Cover Image"
              />
            ) : (
              <span className="opacity-60 text-sm">
                Click to add cover image
              </span>
            )}
          </div>

          {/* color picker  */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className={"text-sm"}>Theme Color</Label>
              {!hasPro && (
                <Badge variant={"secondary"} className={"text-xs gap-1"}>
                  <Crown className="w-3 h-3" />
                  Pro
                </Badge>
              )}
            </div>

            {/* all color presets  */}
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => {
                return (
                  <button
                    key={`${color}`}
                    type="button"
                    className={`w-10 h-10 border-2 border-white rounded-full cursor-pointer transition-all ${
                      !hasPro && color !== "#1e3a8a"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:scale-110"
                    }`}
                    style={{
                      backgroundColor: color,
                      borderColor:
                        themeColor === color ? "white" : "transparent",
                    }}
                    onClick={() => handleColorClick(color)}
                    title={
                      !hasPro && color !== "#1e3a8a"
                        ? "Upgrade to Pro to unlock more colors"
                        : ""
                    }
                  />
                );
              })}

              {!hasPro && (
                <button
                  type="button"
                  onClick={() => {
                    setUpgradeReason("color");
                    setShowUpgradeModal(true);
                  }}
                  className="w-10 h-10 cursor-pointer rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center hover:border-purple-500 transition-colors"
                  title="Unlock more colors with Pro"
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </button>
              )}
            </div>

            {!hasPro && (
              <p className="text-xs text-yellow-500 mt-1">
                Upgrade to Pro to unlock more colors
              </p>
            )}
          </div>
        </div>

        {/* right : form  */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <Input
              {...register("title")}
              placeholder="Event Name"
              className="text-3xl font-semibold bg-transparent border-none focus-visible:ring-0"
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-6">
            {/* Start */}
            <div className="space-y-2">
              <Label className="text-sm">Start</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {startDate ? format(startDate, "PPP") : "Pick date"}
                      <CalendarIcon className="w-4 h-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => setValue("startDate", date)}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  {...register("startTime")}
                  placeholder="hh:mm"
                />
              </div>
              {(errors.startDate || errors.startTime) && (
                <p className="text-sm text-red-400">
                  {errors.startDate?.message || errors.startTime?.message}
                </p>
              )}
            </div>

            {/* End */}
            <div className="space-y-2">
              <Label className="text-sm">End</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {endDate ? format(endDate, "PPP") : "Pick date"}
                      <CalendarIcon className="w-4 h-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => setValue("endDate", date)}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  {...register("endTime")}
                  placeholder="hh:mm"
                />
              </div>
              {(errors.endDate || errors.endTime) && (
                <p className="text-sm text-red-400">
                  {errors.endDate?.message || errors.endTime?.message}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-400">{errors.category.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-sm">Location</Label>
            {/* <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("city", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => (
                        <SelectItem key={s.isoCode} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          selectedState ? "Select city" : "Select state first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div> */}

            <div className="space-y-2 mt-6">
              <Label className="text-sm">Venue Details</Label>

              <Input
                {...register("venue")}
                placeholder="Venue link (Google Maps Link)"
                type="url"
              />
              {errors.venue && (
                <p className="text-sm text-red-400">{errors.venue.message}</p>
              )}

              <Input
                {...register("address")}
                placeholder="Full address / street / building (optional)"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Tell people about your event..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ticketing */}
          <div className="space-y-3">
            <Label className="text-sm">Tickets</Label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="free"
                  {...register("ticketType")}
                  defaultChecked
                />{" "}
                Free
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="paid" {...register("ticketType")} />{" "}
                Paid
              </label>
            </div>

            {ticketType === "paid" && (
              <Input
                type="number"
                placeholder="Ticket price ₹"
                {...register("ticketPrice", { valueAsNumber: true })}
              />
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label className="text-sm">Capacity</Label>
            <Input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="Ex: 100"
            />
            {errors.capacity && (
              <p className="text-sm text-red-400">{errors.capacity.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-lg rounded-xl cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </div>

      {/* unsplash image picker */}
      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            setValue("coverImage", url);
            setShowImagePicker(false);
          }}
        />
      )}

      {/* upgrade modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeReason}
      />
    </div>
  );
};

export default CreateEventPage;
