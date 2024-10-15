import { z } from "zod";

export const authFormSchema = (type: string) =>
  z.object({
    // SIGN UP
    first_name: type === "sign-in" ? z.string().optional() : z.string().min(3),
    last_name: type === "sign-in" ? z.string().optional() : z.string().min(3),
    address1: type === "sign-in" ? z.string().optional() : z.string().max(50),
    city: type === "sign-in" ? z.string().optional() : z.string().max(50),
    postal_code: type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    date_of_birth: type === "sign-in" ? z.string().optional() : z.string().min(3),
    // BOTH
    email: z.string().email(),
    password: z.string().min(8),
  });
