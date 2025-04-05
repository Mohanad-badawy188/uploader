import React, { useState } from "react";
import NavItem from "@/components/layouts/NavItem";
import { LuLayoutGrid } from "react-icons/lu";
import { FaUpload, FaFileAlt, FaHistory, FaUsers } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

type NavLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

const navLinks: ReadonlyArray<NavLink> = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LuLayoutGrid className="h-4 w-4" />,
    adminOnly: false,
  },
  {
    label: "Upload",
    href: "/upload",
    icon: <FaUpload className="h-4 w-4" />,
    adminOnly: false,
  },
  {
    label: "Files",
    href: "/files",
    icon: <FaFileAlt className="h-4 w-4" />,
    adminOnly: false,
  },
  {
    label: "Logs",
    href: "/logs",
    icon: <FaHistory className="h-4 w-4" />,
    adminOnly: true,
  },
  {
    label: "Users",
    href: "/users",
    icon: <FaUsers className="h-4 w-4" />,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button - in its own container */}
      <div
        className={`block md:hidden absolute top-4 ${
          isOpen ? "right-4" : "left-4"
        }  z-50`}
      >
        <button
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full  z-40 transform bg-white border-r shadow-lg transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0 w-full" : "-translate-x-full w-52"
        } md:translate-x-0 md:relative md:shadow-none`}
      >
        <div className="h-16 flex items-center px-4">
          <h1 className="text-xl font-bold">Uploader</h1>
        </div>
        <nav className="space-y-1 px-2">
          {navLinks
            .filter((link) => !link.adminOnly || user?.role === "ADMIN")
            .map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                active={pathname === link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavItem>
            ))}
        </nav>
      </div>
    </>
  );
}
