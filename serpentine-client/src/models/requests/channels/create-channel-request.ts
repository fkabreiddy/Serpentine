import { max } from "date-fns";
import z from "zod";
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) * 1024 * 1024 || 5 * 1024 * 1024; // Default to 5MB if not set

export const createChannelSchema = z.object({
    name: z.string()
  
    .min(3, { message: "The name of the channel must contain at least 3 characters" })
    .max(100, { message: "The name of the channel must contain at less than 100 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "the name must contain just letters, numbers, and underscores" }),
    
    description: z.string()
    .min(10, { message: "The description must be larger than 10 characters" })
    .max(500, { message: "the description must not exceed 500 characters" }),
    
  adultContent: z.boolean().optional().default(false),
  coverPictureFile: z.instanceof(File).nullable().default(null).refine(file => file !== null && file.size <= MAX_FILE_SIZE, {

    message: `The cover picture must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
  }),
  bannerPictureFile: z.instanceof(File).nullable().default(null).refine(file => file !== null && file.size <= MAX_FILE_SIZE, {

    message: `The banner picture must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
  }),
  
  
  
});

export type CreateChannelSchema = z.input<typeof createChannelSchema>;
export type CreateChannelRequest = z.output<typeof createChannelSchema>;