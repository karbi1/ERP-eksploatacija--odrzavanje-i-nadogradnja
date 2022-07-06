import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import Seller from "../components/Seller";

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: "30px",
    paddingRight: "20px",
    paddingTop: "15px",
  },
});

const Sellers = () => {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedSellers, setLoadedSellers] = useState();

  const classes = useStyles();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/sellers");
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedSellers(responseData.sellers);
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
      {!isLoading && loadedSellers && (
        <Grid container spacing={4} className={classes.gridContainer}>
          {loadedSellers.map((loadedSeller, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Seller
                name={loadedSeller.brandName}
                description={loadedSeller.brandDescription}
                id={loadedSeller._id}
                image={loadedSeller.image}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Sellers;
