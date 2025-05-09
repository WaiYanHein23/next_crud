"use client";

import { useSession, signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import UserTable from "./UserTable";
import "../app/globals.css";
import { z } from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(" Must be Email format"),
});

type FormData = z.infer<typeof formSchema>;

type User = {
  id: number;
  username: string;
  email: string;
};

const Layout = () => {
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState<number | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    reset();
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    reset();
  };

  const handleOpenEditModal = (user: User) => {
    setEditUserId(user.id);
    reset({ username: user.username, email: user.email });
    setOpenEditModal(true);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.field && result.error) {
          setError(result.field, { message: result.error });
          return;
        }
        throw new Error(result.error || "Failed to create user");
      }

      mutate("/api/users");
      handleCloseAddModal();
      showSnackbar("User created successfully!", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editUserId) return;

    try {
      const response = await fetch(`/api/users/${editUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.field && result.error) {
          setError(result.field, { message: result.error });
          return;
        }
        throw new Error(result.error || "Failed to update user");
      }

      mutate("/api/users");
      handleCloseEditModal();
      showSnackbar("User updated successfully!", "success");
    } catch (error) {
      console.error("Error:", error);
      showSnackbar(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
    }
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          You must be signed in to access this page
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Login")}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  if (!session) return null;

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography variant="body1">
          Signed in as {session.user?.email}
        </Typography>
        <Button color="error" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Box>

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

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            <TextField
              {...register("username")}
              margin="normal"
              fullWidth
              label="Name"
              autoFocus
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isSubmitting}
            />
            <TextField
              {...register("email")}
              margin="normal"
              fullWidth
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
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

        <Box component="form" onSubmit={handleSubmit(handleUpdate)} noValidate>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isSubmitting}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
