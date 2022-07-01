import React from "react";
import { useEffect, useState, useContext } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

import { AuthContext } from "../../shared/context/auth-context";

export default function OrderHistory() {
  const [isLoading, setIsLoading] = useState();
  const [orders, setOrders] = useState();
  const auth = useContext(AuthContext);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/orders/${auth.userId}`,
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
      setOrders(responseData.orders);
    } catch (err) {
      //setError(err.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {!isLoading && orders && (
        <>
          {orders.map((order, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`Order ID: ${order._id}`}
                  secondary={`Price : ${order.totalPrice}rsd, paid: ${order.paid}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </>
      )}
    </React.Fragment>
  );
}
