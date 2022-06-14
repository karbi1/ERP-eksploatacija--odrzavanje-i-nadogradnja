import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import InputLabel from "@mui/material/InputLabel";
import { useLocation } from "react-router";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import StripeContainer from "../../shared/components/StripeContainer";
import ImageUpload from "../../shared/components/ImageUpload";

const theme = createTheme();

export default function CreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { price } = location.state;
  const [cart, setCart] = useState();
  const [succOrder, setSuccOrder] = useState(false);

  const auth = useContext(AuthContext);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/carts/${auth.userId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setCart(responseData.cart);
    } catch (err) {
      //setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("http://localhost:5000/orders/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: data.get("phoneNumber"),
          address: data.get("address"),
          floor: data.get("floor"),
          postalCode: data.get("postalCode"),
          region: data.get("region"),
          country: data.get("country"),
          city: data.get("city"),
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        setSuccOrder(true);
      }
      console.log(await responseData);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {isLoading && <div>Loading</div>}
      {!isLoading && !succOrder && (
        <ThemeProvider theme={theme}>
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
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <ShoppingBasketIcon fontSize="large" />
            <Typography component="h1" variant="h3">
              New order
            </Typography>
          </Box>
          <Box
            sx={{ ml: 6, mr: 6, mt: 3, mb: 3 }}
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              id="floor"
              label="Floor"
              name="floor"
              type="number"
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              required
              label="Postal code"
              name="postalCode"
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="city"
              label="City"
              name="city"
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="region"
              label="Region"
              name="region"
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="country"
              label="Country"
              name="country"
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Number"
              name="phoneNumber"
              autoFocus
              sx={{ mt: 2 }}
            />
            <Typography>Total price: {price}</Typography>

            <Button
              size="large"
              variant="contained"
              color="success"
              sx={{ mt: 2, mb: 2 }}
              type="submit"
            >
              Place order
            </Button>
          </Box>
        </ThemeProvider>
      )}
      {succOrder && !isLoading && (
        <Box sx={{ mt: 4, mr: 4, ml: 4 }}>
          <Typography variant="h4">Enter card details:</Typography>
          <StripeContainer amount={price} />
          <Typography variant="body">Total price is: {price}</Typography>
        </Box>
      )}
    </React.Fragment>
  );
}
