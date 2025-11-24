import { defineSchema, defineTable } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { register } from "next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup";

export default defineSchema({
  //user details table
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),

    // onboarding
    hasCompletedOnboarding: v.boolean(),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      })
    ),

    // preferences
    interests: v.optional(v.array(v.string())), // min having 3

    freeEventCreated: v.number(), // track free event limit

    // timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token_identifier", ["tokenIdentifier"], { unique: true }),

  // events table
  events: defineTable({
    title: v.string(),
    description: v.string(),
    slug: v.string(),

    //organizer details
    organizerId: v.id("users"),
    organizerName: v.string(),

    // event details
    category: v.string(),
    tags: v.array(v.string()),

    // Date & time
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),

    // location details
    location: v.union(v.literal("online"), v.literal("physical")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),

    // capacity and ticketing
    capacity: v.optional(v.number()),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    registrationCount: v.number(),

    // customizations
    imageUrl: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    // timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_slug", ["slug"])
    .index("search_title", { searchField: "title" }),

  //registrations table
  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    //attendee info
    attendeeName: v.string(),
    attendeeEmail: v.string(),

    // OR code for entry
    qrCode: v.string(),

    //check in
    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),

    //status
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled")
    ),

    //registered at
    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return user;
  },
});
