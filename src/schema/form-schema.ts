import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password must be at most 32 characters" }),
});

export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
