import z from "zod";

export const getUserByUserNameSchema = z.object({

    username: z.string()
    .min(3, "Your name must be at least 3 characters")
    .max(30, "Your name must be less than 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .default(""),

});
export type GetByUsernameRequest = z.output<typeof getUserByUserNameSchema>

  
