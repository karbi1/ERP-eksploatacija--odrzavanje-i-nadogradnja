import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../../shared/context/auth-context";

const theme = createTheme();

export default function EditSeller() {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedSeller, setLoadedSeller] = useState();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/sellers/${auth.userId}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedSeller(responseData.seller);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `http://localhost:5000/sellers/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brandName: data.get("brandName"),
            brandDescription: data.get("brandDescription"),
            email: data.get("email"),
            password: data.get("password"),
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      if (responseData.token) {
        auth.login(responseData.userId, responseData.token);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    window.location.href = `/account`;
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedSeller && (
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
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <AccountCircleIcon color="secondary" fontSize="large" />
              <Typography component="h1" variant="h5">
                Edit Account
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      defaultValue={loadedSeller.brandName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="brandDescription"
                      label="Brand description"
                      name="brandDescription"
                      multiline
                      fullWidth
                      defaultValue={loadedSeller.brandDescription}
                      required
                      rows={3}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      defaultValue={loadedSeller.email}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  color="success"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  save changes
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </React.Fragment>
  );
}
