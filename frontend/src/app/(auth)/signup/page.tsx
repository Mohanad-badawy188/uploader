"use client";

import Link from "next/link";
import SignupForm from "@/components/auth/forms/SignupFrom";
import { withGuestClient } from "@/middlewares/withGuestClient";

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your details below to create your account
          </p>
        </div>

        <SignupForm />

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
export default withGuestClient(SignupPage);
