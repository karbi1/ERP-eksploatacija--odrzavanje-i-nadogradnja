import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useContext } from "react";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/ImageUpload";
import { useEffect } from "react";
import { useParams } from "react-router";

const theme = createTheme();

export default function EditCollection() {
  const params = useParams();
  const auth = useContext(AuthContext);
  const [loadedCollection, setLoadedCollection] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/collections/${params.id}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedCollection(responseData.collection);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `http://localhost:5000/collections/${loadedCollection._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller: auth.userId,
            name: data.get("name"),
            description: data.get("description"),
            created: data.get("date"),
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
    window.location.href = `/sellers/${auth.userId}/collections/${loadedCollection._id}`;
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {!isLoading &&
        loadedCollection &&
        loadedCollection.seller === auth.userId && (
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 5,
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
                  open={isLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <CheckroomIcon fontSize="large" />
                <Typography component="h1" variant="h3">
                  Edit collection
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    defaultValue={loadedCollection.name}
                    id="name"
                    label="Collection name"
                    name="name"
                    autoFocus
                    sx={{ mt: 3 }}
                  />

                  <TextField
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    fullWidth
                    required
                    defaultValue={loadedCollection.description}
                    rows={3}
                    placeholder="Description"
                    sx={{ mb: 1, mt: 2 }}
                  />
                  <ImageUpload />
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <div className="input-group">
                      <input
                        defaultValue={loadedCollection.created}
                        type="date"
                        name="date"
                        id="date"
                      />
                      <label htmlFor="date">Date</label>
                    </div>
                  </Grid>
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    type="submit"
                  >
                    Save changes
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        )}
    </React.Fragment>
  );
}
