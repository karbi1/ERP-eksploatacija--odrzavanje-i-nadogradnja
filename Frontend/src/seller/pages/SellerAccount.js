import { Button, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";

export default function SellerAccount() {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedSeller, setLoadedSeller] = useState();
  const auth = useContext(AuthContext);

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

  return (
    <React.Fragment>
      {isLoading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedSeller && (
        <Box sx={{ m: 5, justifyContent: "flex" }}>
          <Typography variant="h1">{loadedSeller.brandName}</Typography>
          <Typography variant="body" sx={{ mt: 2 }}>
            {loadedSeller.brandDescription}
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
            Email: {loadedSeller.email}
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
}
