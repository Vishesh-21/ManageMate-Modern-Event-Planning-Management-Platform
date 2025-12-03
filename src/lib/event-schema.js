import z from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 10 characters long"),
  category: z.string().min(1, "Category must be at least 1 characters long"),
  tags: z.array(
    z.string().min(3, "Each tag must be at least 3 characters long")
  ),
  startDate: z
    .string()
    .regex(timeRegex, "Start date must be in HH:MM 24-hour format"),
  endDate: z
    .string()
    .regex(timeRegex, "End date must be in HH:MM 24-hour format"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  //   country: z.string().optional().min(1, "Country is required"),

  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketPrice: z.number().min(0, "Ticket price cannot be negative"),
  coverImage: z.string().optional(),
  tickerType: z.enum(["free", "paid"]).default("free"),
  themeColor: z.string().default("#1e3a8a"),
});
