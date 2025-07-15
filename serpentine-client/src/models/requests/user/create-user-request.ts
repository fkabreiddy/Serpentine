import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) * 1024 * 1024 || 5 * 1024 * 1024; // Default to 5MB if not set

export const createAccountSchema = z.object({
    fullName: z.string()
        .min(3, "Your name must be at least 3 characters")
        .max(30, "Your name must be less than 30 characters")
        .default(""),
  
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9._]{3,30}$/, "Username can only contain letters, numbers, dots and underscores")
        .default(""),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character")
        .default(""),
           
    confirmPassword: z.string().default(""),

    imageFile: z
        .union([z.instanceof(File), z.null()])
        .optional()
        .refine(
          file => file === null || file === undefined || file.size <= MAX_FILE_SIZE,
          {
            message: `The profile picture must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
          }
        )
        .default(null),
    dayOfBirth: z.instanceof(CalendarDate).default(today(getLocalTimeZone()))

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export type CreateUserRequest = z.output<typeof createAccountSchema>;