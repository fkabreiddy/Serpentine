import { z } from "zod";

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
});

export type UpdateChannelSchema = z.input<typeof updateChannelSchema>;
export type UpdateChannelRequest = z.output<typeof updateChannelSchema>;