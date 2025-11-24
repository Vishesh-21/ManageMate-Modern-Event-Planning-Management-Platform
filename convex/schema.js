import { defineSchema, defineTable } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

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
