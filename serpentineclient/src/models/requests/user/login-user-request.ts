import z from "zod";

export const loginUserSchema = z.object({


    username: z.string()
        .max(30, "Your name must be less than 30 characters")
        .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores")
        .default(""),
        
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character")
        .default(""),
})

export type LoginUserRequest = z.output<typeof loginUserSchema>

