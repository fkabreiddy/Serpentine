import z from "zod";

export const updateGroupSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name must be less than 30 characters")
        .default(""),
    
    public: z.boolean().default(true),
    requiresOverage: z.boolean().default(true),
    groupId: z.string().default("")

   

   

});

export type UpdateGroupRequest = z.output<typeof updateGroupSchema>;