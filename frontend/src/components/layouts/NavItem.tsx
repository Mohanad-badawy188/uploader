import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function NavItem({
  children,
  href,
  icon,
  active,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = active ?? pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md",
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
}
