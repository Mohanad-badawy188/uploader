"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiMoreHorizontal } from "react-icons/fi";
import { UserWithStats } from "@/app/users/page";
import NoItemsFound from "../common/NoItemsFound";
import { formatDate } from "@/helper/formatDate";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/app/modals/confirmDeleteModal";
import { BsTrash } from "react-icons/bs";

export function UsersTable({
  users,
  refetch,
}: {
  users: UserWithStats[] | undefined;
  refetch: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleOpenDeleteModal = (user: UserWithStats) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user);
  };
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.delete(`users/${selectedUser.id}`);
      if (res.data) {
        toast.success("User deleted successfully");
        refetch();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Delete failed";
      toast.error(message);
    }
  };

  if (!users) return <NoItemsFound />;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Upload Statistics</CardTitle>
          <CardDescription>
            Overview of users file uploads and processing status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Total Uploads</TableHead>
                <TableHead>Processed Files</TableHead>
                <TableHead>Processing Rate</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : user.role === "USER"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="!ps-5">{user.totalFiles}</TableCell>
                  <TableCell className="!ps-5">{user.processedFiles}</TableCell>
                  <TableCell>
                    {user.totalFiles > 0
                      ? `${Math.round(
                          (user.processedFiles / user.totalFiles) * 100
                        )}%`
                      : "0%"}
                  </TableCell>
                  <TableCell>
                    {user.lastActivity && formatDate(user.lastActivity)}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "ADMIN" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <FiMoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleOpenDeleteModal(user)}
                          >
                            <BsTrash className="text-red-500" />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDeleteModal
        description="Are you sure you want to delete this user? This action cannot be undone."
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
