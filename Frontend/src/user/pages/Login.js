import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";

import ErrorModal from "../../shared/components/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const theme = createTheme();

export default function SignIn() {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      }
      if (responseData.token) {
        auth.login(responseData.userId, responseData.token, responseData.role);
      }
    } catch (err) {}
    setLoading(false);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />

          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => handleSubmit(onSubmit)(e)}
              noValidate
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register("email", {
                  required: "Required field",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors?.email}
                helperText={errors?.email ? errors.email.message : null}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.password}
                helperText={errors?.password ? errors.password.message : null}
              />
              <Button
                size="large"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                type="submit"
              >
                Sign In
              </Button>
              <hr />

              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/signup"
              >
                <Button
                  color="success"
                  fullWidth
                  size="medium"
                  variant="contained"
                >
                  Create new account
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
