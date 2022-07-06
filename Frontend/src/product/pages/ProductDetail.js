import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography, Button, ListItem } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import List from "@mui/material/List";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/ErrorModal";

export default function ProductDetail() {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProduct, setLoadedProduct] = useState();
  const [sellerCollections, setSellerCollections] = useState();
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState();
  const params = useParams();

  const handleDecrement = () => {
    if (amount > 1) {
      setAmount((prevCount) => prevCount - 1);
    }
  };

  const handleIncrement = () => {
    setAmount((prevCount) => prevCount + 1);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${loadedProduct._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        console.log(responseData);
      }
    } catch (err) {
      console.log(err.message);
    }
    window.location.href = `http://localhost:3000/sellers/${loadedProduct.seller}/collections`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`http://localhost:5000/carts`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: loadedProduct.id,
          amount: amount,
          size: data.get("size"),
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      } else {
        console.log(responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedProduct && (
        <Paper sx={{ mt: 12, ml: 10, mr: 10, padding: 3 }} elevation={3}>
          <ErrorModal error={error} onClear={errorHandler} />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The houe from the offer."
                src={loadedProduct.image}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3">{loadedProduct.name}</Typography>
              <Typography variant="h5">
                Price: {loadedProduct.price}rsd
              </Typography>
              <Typography sx={{ mt: 2 }} variant="body1">
                {loadedProduct.description}
              </Typography>

              <hr />
              <List>
                <ListItem>S: {loadedProduct.s}</ListItem>
                <ListItem>M: {loadedProduct.m}</ListItem>
                <ListItem>L: {loadedProduct.l}</ListItem>
                <ListItem>XL: {loadedProduct.xl}</ListItem>
              </List>
              <hr />
            </Grid>
            {auth.role === "Buyer" && !isLoading && (
              <Grid item xs={3}>
                <Box
                  sx={{ mt: 12, ml: 8 }}
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div align="center">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="size"
                      >
                        <FormControlLabel
                          value="S"
                          control={<Radio />}
                          label="S"
                        />
                        <FormControlLabel
                          value="M"
                          control={<Radio />}
                          label="M"
                        />
                        <FormControlLabel
                          value="L"
                          control={<Radio />}
                          label="L"
                        />
                        <FormControlLabel
                          value="XL"
                          control={<Radio />}
                          label="XL"
                        />
                      </RadioGroup>

                      <Button onClick={handleDecrement}>-</Button>
                      <Typography align="center">{amount}</Typography>
                      <Button onClick={handleIncrement}>+</Button>
                    </FormControl>

                    <Button
                      justify="center"
                      color="success"
                      variant="contained"
                      type="submit"
                    >
                      Add to cart
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
            {!auth.role && (
              <>
                <Box justifyContent="center" margin="auto">
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Typography variant="h2" color="error">
                      Log in to buy
                    </Typography>
                  </Link>
                </Box>
              </>
            )}
            {(loadedProduct.seller === auth.userId ||
              auth.role === "Admin") && (
              <Box sx={{ mt: 20, ml: 15 }}>
                <Link
                  to={`/edit/product/${loadedProduct._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button>Edit</Button>
                </Link>
                <Button color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            )}
          </Grid>
        </Paper>
      )}
    </React.Fragment>
  );
}
