import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const createCompetitionSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    description: z.string().trim().optional(),
    metricType: z.enum(["QUANTITY", "COUNT", "CHECK"]),
    unit: z.string().trim().optional(),
    rankingMethod: z.enum(["TOTAL", "CONSISTENCY", "COMBINED"]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.metricType !== "CHECK" && !data.unit) return false;
      return true;
    },
    {
      message: "Unit is required for Quantity and Count metrics",
      path: ["unit"],
    }
  );

export type CreateCompetitionValues = z.infer<typeof createCompetitionSchema>;

export const joinCompetitionSchema = z.object({
  code: z.string().trim().min(1, "Invite code is required"),
});

export type JoinCompetitionValues = z.infer<typeof joinCompetitionSchema>;

export const quantityEntrySchema = z.object({
  amount: z
    .number({ error: "Enter a valid number" })
    .int("Must be a whole number")
    .positive("Must be greater than 0")
    .max(100000, "Maximum 100,000 per entry"),
});

export type QuantityEntryValues = z.infer<typeof quantityEntrySchema>;

export const profileSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      if (data.currentPassword && !data.newPassword) return false;
      return true;
    },
    {
      message: "Both current and new password are required to change password",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) return false;
      return true;
    },
    {
      message: "New password must be at least 8 characters",
      path: ["newPassword"],
    },
  );

export type ProfileValues = z.infer<typeof profileSchema>;
