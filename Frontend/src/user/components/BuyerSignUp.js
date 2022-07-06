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

import "../../shared/DatePicker.css";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/ErrorModal";

const theme = createTheme();

export default function SellerSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
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
      const response = await fetch("http://localhost:5000/buyers/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          dateOfBirth: event.target.dateOfBirth.value,
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
        <Container component="main" maxWidth="xs">
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="First Name"
                    autoFocus
                    {...register("name", {
                      required: "Required field",
                      pattern: {
                        message: "Required field",
                      },
                    })}
                    error={!!errors?.name}
                    helperText={errors?.name ? errors.name.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    {...register("lastName", {
                      required: "Required field",
                      pattern: {
                        message: "Required field",
                      },
                    })}
                    error={!!errors?.lastName}
                    helperText={
                      errors?.lastName ? errors.lastName.message : null
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
                <Grid item xs={12}>
                  <div className="input-group">
                    <input
                      {...register("date")}
                      type="date"
                      name="dateOfBirth"
                      id="date"
                    />
                    <label htmlFor="date">Date</label>
                  </div>
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
