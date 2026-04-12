import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password must be at most 32 characters" }),
});

export const signUpFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(32, { message: "Name must be at most 32 characters" }),
  email: z.string().email().trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password must be at most 32 characters" }),
  profile_pic: z
    .instanceof(File, { message: "Profile picture is required." })
    .refine((file) => file.size > 0, "File is required.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB.",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "File must be a JPEG, PNG, or WebP image.",
    ),
});

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;
export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
// onChange={(e) => field.onChange(e.target.files?.[0])}
