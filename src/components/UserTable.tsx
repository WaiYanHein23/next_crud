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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  id: number;
  username: string;
  email: string;
}

type Props = {
  handleOpenEditModal?: (user: User) => void;
};

const UserTable: React.FC<Props> = ({ handleOpenEditModal }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const { data, error, isLoading } = useSWR<{
    users: User[];
    totalUsers: number;
    totalPages: number;
  }>(`/api/users?pageNum=${page}&rowsPerPage=${rowsPerPage}`, fetcher);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

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

      window.location.reload();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="user table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2196f3" }}>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ color: "#fff" }}>No</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users?.map((user, index) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox"></TableCell>
                <TableCell sx={{ color: "#0d47a1" }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
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

      <TablePagination
        component="div"
        count={data?.totalUsers || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
      />
    </>
  );
};

export default UserTable;