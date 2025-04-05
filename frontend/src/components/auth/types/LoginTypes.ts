import { z } from "zod";
import { loginSchema } from "../schemas/LoginSchema";

export type LoginFormData = z.infer<typeof loginSchema>;
