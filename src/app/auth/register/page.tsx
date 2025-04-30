"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  username: string;
  password: string;
};

type ValidationError = {
  [key: string]: string[] | undefined;
};

const RegisterPage = () => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setValidationErrors({});
      setApiError("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      console.log(resData);
      if (!res.ok) {
        if (resData.errors) {
          // Handle Zod validation errors from backend
          setValidationErrors(resData.errors);
        } else {
          setApiError(resData.message || "Registration failed");
        }
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (error) {
      setApiError("An unexpected error occurred");
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f0f0"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {apiError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Success</AlertTitle>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Username cannot exceed 20 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers and underscores allowed",
              },
            })}
            error={!!errors.username || !!validationErrors.username}
            helperText={
              errors.username?.message || validationErrors.username?.join(", ")
            }
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Must include uppercase, lowercase and number",
              },
            })}
            error={!!errors.password || !!validationErrors.password}
            helperText={
              errors.password?.message || validationErrors.password?.join(", ")
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
