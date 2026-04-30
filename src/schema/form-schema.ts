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
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required.")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Invalid image type",
    )
    .optional()
    .or(z.undefined()),
});

export const createUrlSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(32, { message: "Title must be at most 32 characters" }),
  original_url: z.string().url({ message: "Invalid URL" }),
  custom_url: z.string().trim().toLowerCase().optional(),
});

export const editUrlSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(32, { message: "Title must be at most 32 characters" }),
  original_url: z.string().url({ message: "Invalid URL" }),
  custom_url: z.string().trim().toLowerCase().optional(),
});

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;
export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
export type createUrlSchemaType = z.infer<typeof createUrlSchema>;
export type editUrlSchemaType = z.infer<typeof editUrlSchema>;
