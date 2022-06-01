import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProduct, setLoadedProduct] = useState();
  const params = useParams();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/products/${params.id}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedProduct(responseData.product);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, [params]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <h1>loading</h1>
        </div>
      )}
      {isLoading && (
        <div>
          <h1>Loading</h1>
        </div>
      )}{" "}
      {!isLoading && loadedProduct && (
        <Paper sx={{ mt: 10 }} elevation={3}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The house from the offer."
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
              />
            </Grid>
            <Grid item xs={7}>
              <Typography variant="h5">{loadedProduct.name}</Typography>
              <Typography variant="body1">
                {loadedProduct.description}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </React.Fragment>
  );
}
