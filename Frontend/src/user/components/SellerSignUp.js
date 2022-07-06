import * as React from "react";
import { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FileBase64 from "react-file-base64";
import { useForm } from "react-hook-form";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/ErrorModal";

const theme = createTheme();

export default function SellerSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [item, setItem] = useState("");

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setLoading(true);
    if (item === "") {
      setError("Must provide image");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/sellers/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: data.brandName,
          brandDescription: data.brandDescription,
          email: data.email,
          password: data.password,
          image: item,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      }
      if (responseData.token) {
        auth.login(responseData.userId, responseData.token, responseData.role);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => handleSubmit(onSubmit)(e)}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="brandName"
                    required
                    fullWidth
                    id="brandName"
                    label="Brand name"
                    autoFocus
                    {...register("brandName", {
                      required: "Required field",
                      pattern: {
                        message: "Required field",
                      },
                    })}
                    error={!!errors?.brandName}
                    helperText={
                      errors?.brandName ? errors.brandName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="brandDescription"
                    label="Brand description"
                    name="brandDescription"
                    multiline
                    fullWidth
                    required
                    rows={3}
                    placeholder="Brand description"
                    {...register("brandDescription", {
                      required: "Required field",
                      pattern: {
                        message: "Required field",
                      },
                    })}
                    error={!!errors?.brandDescription}
                    helperText={
                      errors?.brandDescription
                        ? errors.brandDescription.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Required field",
                      minLength: 8,
                      pattern: {
                        message: "8 characters minimum",
                      },
                    })}
                    error={!!errors?.password}
                    helperText={
                      errors?.password ? errors.password.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FileBase64
                    type="file"
                    multiple={false}
                    onDone={(base64) => setItem(base64)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
