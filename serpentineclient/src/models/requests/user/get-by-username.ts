import z from "zod";

export const getUserByUserNameSchema = z.object({

    username: z.string()
    .min(3, "Your name must be at least 3 characters")
    .max(30, "Your name must be less than 30 characters")
    .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores")
    .default(""),

});
export type GetByUsernameRequest = z.output<typeof getUserByUserNameSchema>

  
