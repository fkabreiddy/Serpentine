import { z } from "zod";

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) * 1024 * 1024 || 5 * 1024 * 1024; // Default to 5MB if not set

export const updateChannelSchema = z.object({
  
    channelId: z.string(),
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" })
    .regex(/^[a-zA-Z0-9._]+$/, {
      message: "Name can only contain letters, numbers, dots and underscores",
    }),

  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),

  adultContent: z.boolean(),
    coverPictureFile: z
        .union([z.instanceof(File), z.null()])
        .optional()
        .refine(
            file => file === null || file === undefined || file.size <= MAX_FILE_SIZE,
            {
                message: `The cover picture must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
            }
        )
        .default(null),

    bannerPictureFile: z
        .union([z.instanceof(File), z.null()])
        .optional()
        .refine(
            file => file === null || file === undefined || file.size <= MAX_FILE_SIZE,
            {
                message: `The banner picture must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
            }
        )
        .default(null),
});

export type UpdateChannelSchema = z.input<typeof updateChannelSchema>;
export type UpdateChannelRequest = z.output<typeof updateChannelSchema>;