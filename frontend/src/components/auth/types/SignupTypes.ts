import { z } from "zod";
import { signupSchema } from "../schemas/SignupSchema";

export type SignupFormData = z.infer<typeof signupSchema>;
