"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiLogIn, FiTrash2 } from "react-icons/fi";
import { BsUpload } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { UserActivityLog } from "@/types/Logs";
import { formatDate } from "@/helper/formatDate";

interface Props {
  logs: UserActivityLog[];
}

export function LogsTable({ logs }: Props) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <FiLogIn className="h-4 w-4 mr-1" />;
      case "UPLOAD_FILE":
        return <BsUpload className="h-4 w-4 mr-1" />;
      case "DELETE_FILE":
        return <FiTrash2 className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "LOGIN":
        return (
          <Badge className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 border border-blue-300">
            {getActionIcon(action)} Login
          </Badge>
        );
      case "UPLOAD_FILE":
        return (
          <Badge className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-700 border border-green-300">
            {getActionIcon(action)} Upload
          </Badge>
        );
      case "DELETE_FILE":
        return (
          <Badge className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-700 border border-red-300">
            {getActionIcon(action)} Delete
          </Badge>
        );
      default:
        return (
          <Badge className="px-2 py-1 text-sm border">
            {getActionIcon(action)} {action}
          </Badge>
        );
    }
  };

  return (
    <div className="border rounded-lg overflow-x-auto bg-white shadow-sm">
      <Table className="min-w-full text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[180px]">Date & Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead className="hidden md:table-cell">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="text-muted-foreground">
                  {formatDate(log.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{log.user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.user?.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getActionBadge(log.action)}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {log.details}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
