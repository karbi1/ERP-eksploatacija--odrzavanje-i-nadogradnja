import { Button, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";

export default function BuyerAccount() {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedBuyer, setLoadedBuyer] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/buyers/${auth.userId}`,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedBuyer(responseData.buyer);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {isLoading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedBuyer && (
        <Box sx={{ m: 5, justifyContent: "flex" }}>
          <Typography variant="h1">
            {loadedBuyer.name} {loadedBuyer.lastName}
          </Typography>
          <Typography variant="body" sx={{ mt: 2 }}>
            {loadedBuyer.dateOfBirth}
          </Typography>
          <Link to={`/account/edit`} style={{ textDecoration: "none" }}>
            <Button
              size="large"
              sx={{ ml: 3 }}
              variant="outlined"
              color="warning"
            >
              edit account
            </Button>
          </Link>
          <hr />
          <Typography variant="body" sx={{ mt: 2 }}>
            Email: {loadedBuyer.email}
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
}
