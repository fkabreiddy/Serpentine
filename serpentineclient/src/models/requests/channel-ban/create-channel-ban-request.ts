import z from "zod";

export const createChannelBanSchema = z.object({
  channelId: z.string().default(""),
  userId: z.string().default(""),

  reason: z.string()
    .min(5, { message: "The description must be larger than 5 characters" })
    .max(300, { message: "the description must not exceed 300 characters" })
    .default(""),

 
});

export type CreateChannelBanSchema = z.input<typeof createChannelBanSchema>;
export type CreateChannelBanRequest = z.output<typeof createChannelBanSchema>;