"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { logoutUser } from "@/server-actions/auth";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FaRegUser className="size-4" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <FaRegUser className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
        >
          <MdLogout className="mr-2 h-4 w-4 text-red-500" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
