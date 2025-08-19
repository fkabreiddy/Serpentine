import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";

export const createGroupSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name must be less than 30 characters")
        .default(""),

   
    
    public: z.boolean().default(true),
    requiresOverage: z.boolean().default(true),
    channelId: z.string().default("")

   

   

});

export type CreateGroupRequest = z.output<typeof createAccountSchema>;