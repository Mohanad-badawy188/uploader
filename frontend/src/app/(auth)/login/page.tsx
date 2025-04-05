"use server";

import LoginForm from "@/components/auth/forms/LoginForm";
import { withGuest } from "@/middlewares/withGuest";
import Link from "next/link";

const LoginPage = async () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withGuest(LoginPage);
