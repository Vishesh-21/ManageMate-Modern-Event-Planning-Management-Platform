import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    hasPro: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    try {
      const user = await ctx.runQuery(internal.users.getCurrentUser);

      //server side check : verify event limit for the free users
      if (!hasPro && user.freeEventsCreated > 10) {
        throw new Error(
          "You have reached the limit of free events. Please upgrade to a paid plan to create more events."
        );
      }

      const defaultColor = "#1e3a8a";
      if (!hasPro && args.themeColor && args.themeColor !== defaultColor) {
        throw new Error(
          "Custom theme color is not allowed for free users. Please upgrade to a paid plan to use custom theme colors."
        );
      }

      const themeColor = hasPro ? args.themeColor : defaultColor;

      //generate slug from title
      const slug = args.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const eventId = await ctx.db.insert("events", {
        ...args,
        themeColor,
        slug: `${slug}-${Date.now()}`,
        organizerId: user._id,
        organizerName: user.name,
        registrationCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      //update user free events created count
      await ctx.db.patch(user._id, {
        freeEventsCreated: user.freeEventsCreated + 1,
      });

      return eventId;
    } catch (error) {
      throw new Error("Failed to create event: " + error.message);
    }
  },
});

//get event by slug
export const getEventBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return event;
  },
});

//get events by organizer
export const getEventsByOrganizer = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", user._id))
      .collect();
    return events;
  },
});

//delete event by id
export const deleteEventById = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found.");
    if (event.organizerId !== user._id) {
      throw new Error("You are not authorized to delete this event.");
    }

    //delete all registration for this event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const reg of registrations) {
      await ctx.db.delete(reg._id);
    }

    await ctx.db.delete(args.eventId);

    if (user.freeEventsCreated > 0) {
      await ctx.db.patch(user._id, {
        freeEventsCreated: user.freeEventsCreated - 1,
      });
    }
    return { success: true };
  },
});
