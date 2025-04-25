"use client";

import { useForm } from "react-hook-form";
import React from "react";
import { mutate } from "swr";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  TableContainer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import UserTable from "./UserTable";
import "../app/globals.css";

interface FormData {
  username: string;
  email: string;
}

const Layout = () => {
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState<number | null>(null);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const handleOpenEditModal = (user: any) => {
    setEditUserId(user.id);
    reset({ username: user.username, email: user.email });
    setOpenEditModal(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.error);
        return;
      }

      mutate("/api/users");
      handleCloseAddModal();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editUserId) return;

    try {
      const res = await fetch(`/api/users/${editUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Update failed:", result.error);
        return;
      }

      mutate("/api/users");
      handleCloseEditModal();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <>
      {/* Add Employee Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Add Employee</Typography>
            <IconButton onClick={handleCloseAddModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register("username", { required: true })}
              margin="normal"
              required
              fullWidth
              label="Name"
              autoFocus
            />
            <TextField
              {...register("email", { required: true })}
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal}>Cancel</Button>
            <Button type="submit" variant="contained" color="success">
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Edit Employee</Typography>
            <IconButton onClick={handleCloseEditModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(handleUpdate)}>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("username", { required: "Name is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
            <Button type="submit" variant="contained" color="info">
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Main Content */}
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Navbar onAddClick={handleOpenAddModal} />
            <TableContainer>
              <UserTable handleOpenEditModal={handleOpenEditModal} />
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Layout;
