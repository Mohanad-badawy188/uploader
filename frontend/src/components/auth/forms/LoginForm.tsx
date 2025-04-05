"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/LoginSchema";
import { toast } from "react-toastify";
import { LoginFormData } from "../types/LoginTypes";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login as loginAction } from "@/server-actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "user@test.com",
      password: "test123",
    },
  });

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);

    try {
      const res = await loginAction(values);
      const { user } = res;
      login(user);
      toast.success("Login successful!");
      router.push("/");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
