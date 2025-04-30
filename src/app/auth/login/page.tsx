"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Inputs>();

  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin"
          ? "Invalid username or password"
          : "Authentication failed"
      );
    }
  }, [searchParams]);

  const onSubmit = async (data: Inputs) => {
    try {
      setError("");
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl: "http://localhost:3000/",
      });

      console.log("NextAuth response:", res);

      if (res?.error) {
        setError(
          res.error.includes("Credentials")
            ? "Invalid username or password"
            : res.error.replace(/Error: /i, "")
        );
      } else {
        router.push(res?.url || "/"); // Default redirect
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username too short" },
            })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password too short" },
            })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?
          <Button
            variant="text"
            color="primary"
            onClick={() => router.push("/auth/register")}
            sx={{ ml: 1 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
