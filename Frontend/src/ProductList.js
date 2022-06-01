import { Grid } from "@mui/material";
import ProductItem from "./ProductItem";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: "30px",
    paddingRight: "20px",
    paddingTop: "15px",
  },
});

export default function ProductList() {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedProducts, setLoadedProducts] = useState();

  const classes = useStyles();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/products");
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedProducts(responseData.products);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  /*const errorHandler = () => {
    setError(null);
  };*/

  return (
    <React.Fragment>
      {isLoading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!isLoading && loadedProducts && (
        <Grid container spacing={4} className={classes.gridContainer}>
          {loadedProducts.map((loadedProduct, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductItem
                title={loadedProduct.name}
                price={loadedProduct.price}
                id={loadedProduct._id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
}
