import z from "zod";

export const loginUserSchema = z.object({


    username: z.string()
        .max(30, "Your name must be less than 30 characters")
        .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores")
        .default(""),
        
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .default(""),
})

export type LoginUserRequest = z.output<typeof loginUserSchema>

