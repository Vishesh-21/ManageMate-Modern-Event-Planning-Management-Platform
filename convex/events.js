import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async ({ ctx, args }) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .collect();

    const featured = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 3);

    return featured;
  },
});

export const getEventsByLocation = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    limit: v.optional(v.number()),
    country: v.optional(v.string()),
  },
  handler: async ({ ctx, args }) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    if (args.city) {
      events = events.filter(
        (event) => event.city.toLowerCase() === args.city.toLowerCase()
      );
    } else if (args.state) {
      events = events.filter(
        (event) => event.state.toLowerCase() === args.state.toLowerCase()
      );
    } else if (args.country) {
      events = events.filter(
        (event) => event.country.toLowerCase() === args.country.toLowerCase()
      );
    }

    return events.slice(0, args.limit ?? 4);
  },
});

//To get popular events by registration count
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async ({ ctx }) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    const popular = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 6);

    return popular;
  },
});

//To get popular events by category
export const getEventsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async ({ ctx }) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    return events.slice(0, args.limit ?? 10);
  },
});

export const getCategoryCount = query({
  handler: async ({ ctx }) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();
    const categoryCount = events.reduce((acc, event) => {
      const category = event.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return categoryCount;
  },
});


