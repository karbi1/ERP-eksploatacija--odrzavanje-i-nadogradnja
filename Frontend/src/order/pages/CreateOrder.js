import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";

import { AuthContext } from "../../shared/context/auth-context";
import StripeContainer from "../../shared/components/StripeContainer";
import ErrorModal from "../../shared/components/ErrorModal";

const theme = createTheme();

export default function CreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { price } = location.state;
  const [cart, setCart] = useState();
  const [error, setError] = useState();
  const [succOrder, setSuccOrder] = useState(false);
  const [orderId, setOrderId] = useState();
  const [billingDetails, setBillingDetails] = useState();

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
        setError(responseData.message || "Something went wrong");
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

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/orders/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: data.phoneNumber,
          address: data.address,
          floor: data.floor,
          postalCode: data.postalCode,
          region: data.region,
          country: data.country,
          city: data.city,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      } else {
        setOrderId(responseData.order._id);

        setSuccOrder(true);
      }
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {isLoading && <div>Loading</div>}
      {!isLoading && !succOrder && (
        <>
          <ErrorModal error={error} onClear={errorHandler} />
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
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
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
              onSubmit={(e) => handleSubmit(onSubmit)(e)}
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
                {...register("address", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.address}
                helperText={errors?.address ? errors.address.message : null}
              />
              <TextField
                id="floor"
                label="Floor"
                name="floor"
                type="number"
                fullWidth
                required
                sx={{ mt: 2 }}
                {...register("floor", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.floor}
                helperText={errors?.floor ? errors.floor.message : null}
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
                {...register("postalCode", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.postalCode}
                helperText={
                  errors?.postalCode ? errors.postalCode.message : null
                }
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
                {...register("city", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.city}
                helperText={errors?.city ? errors.city.message : null}
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
                {...register("region", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.region}
                helperText={errors?.region ? errors.region.message : null}
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
                {...register("country", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.country}
                helperText={errors?.country ? errors.country.message : null}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Number"
                name="phoneNumber"
                autoFocus
                sx={{ mt: 2 }}
                {...register("phoneNumber", {
                  required: "Required field",
                  pattern: {
                    message: "Required field",
                  },
                })}
                error={!!errors?.phoneNumber}
                helperText={
                  errors?.phoneNumber ? errors.phoneNumber.message : null
                }
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
        </>
      )}
      {succOrder && !isLoading && (
        <Box sx={{ mt: 4, mr: 4, ml: 4 }}>
          <Typography variant="h4">Enter card details:</Typography>
          <StripeContainer
            billingDetails={billingDetails}
            amount={price}
            orderId={orderId}
          />
          <Typography variant="body">Total price is: {price}</Typography>
        </Box>
      )}
    </React.Fragment>
  );
}
