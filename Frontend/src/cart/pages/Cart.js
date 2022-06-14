import React from "react";
import { useEffect, useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";

import { AuthContext } from "../../shared/context/auth-context";
import CartItemList from "../components/CartItemList";
import { Link } from "react-router-dom";
import StripeContainer from "../../shared/components/StripeContainer";

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: "30px",
    paddingRight: "20px",
    paddingTop: "15px",
  },
});

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedCart, setLoadedCart] = useState();
  const [showItem, setShowItem] = useState(false);
  const [totalPrice, setTotalPrice] = useState();
  const auth = useContext(AuthContext);
  const classes = useStyles();

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

      setLoadedCart(responseData.cart);
      setTotalPrice(loadedCart.price);
    } catch (err) {
      //setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, []);

  const cartItemRemovedHandler = async (cartItemId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/carts/${cartItemId}`,
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
        console.log(responseData.message);
      }
    } catch (err) {}
    sendRequest();
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedCart && (
        <>
          <CartItemList cart={loadedCart} onRemove={cartItemRemovedHandler} />
          <div>back: {loadedCart.price}</div>
          <Link to={"/order"} state={{ price: loadedCart.price }}>
            <Button>Create order</Button>
          </Link>
        </>
      )}
    </React.Fragment>
  );
}
