// components/UserTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  id: number;
  username: string;
  email: string;
}

interface Props {
  handleOpenEditModal?: (user: User) => void;
}

const UserTable: React.FC<Props> = ({ handleOpenEditModal }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useSWR<{ data: User[] }>("/api/users", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete failed:", errorData.error);
        return;
      }

      mutate("/api/users"); // Refresh the list
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="user table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#2196f3" }}>
            <TableCell padding="checkbox"></TableCell>
            <TableCell sx={{ color: "#fff" }}>No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user, index) => (
            <TableRow key={user.id} hover>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ color: "#0d47a1" }}>{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenEditModal?.(user)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
