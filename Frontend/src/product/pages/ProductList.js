import { Button, Grid, Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";

import ProductItem from "../components/ProductItem";
import AppPagination from "../../shared/components/AppPagination";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    paddingLeft: "30px",
    paddingRight: "20px",
    paddingTop: "15px",
  },
}));

export default function ProductList(props) {
  let products = props.products;
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState();
  const [permanentProducts, setPermanentProducts] = useState();

  const classes = useStyles();

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/products");
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoadedProducts(responseData.products);
      setPermanentProducts(responseData.products);
    } catch (err) {}
    setIsLoading(false);
  };

  const handleSortPriceAscending = () => {
    const sortedAscending = []
      .concat(loadedProducts)
      .sort((a, b) => (a.price > b.price ? 1 : -1));
    setLoadedProducts(sortedAscending);
  };

  const handleSortPriceDescending = () => {
    const sortedAscending = []
      .concat(loadedProducts)
      .sort((a, b) => (a.price < b.price ? 1 : -1));
    setLoadedProducts(sortedAscending);
  };

  const handleFilterTshirt = () => {
    setIsLoading(true);
    setLoadedProducts(permanentProducts);
    setLoadedProducts((prev) =>
      prev.filter((prod) => prod.productType.type === "majica")
    );
    setIsLoading(false);
  };

  const handleFilterShorts = () => {
    setIsLoading(true);
    setLoadedProducts(permanentProducts);
    setLoadedProducts((prev) =>
      prev.filter((prod) => prod.productType.type === "sorc")
    );
    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, []);

  if (props.products === undefined) {
    return (
      <React.Fragment>
        {isLoading && (
          <div>
            <h1>loading</h1>
          </div>
        )}
        {!isLoading && loadedProducts && (
          <>
            <Button onClick={handleSortPriceAscending}>
              Sort by price ascending
            </Button>
            <Button onClick={handleSortPriceDescending}>
              Sort by price descending
            </Button>
            <Button onClick={handleFilterTshirt}>Show only: majice</Button>
            <Button onClick={handleFilterShorts}>Show only: sorcevi</Button>
            <Button onClick={sendRequest}>Reset filter</Button>
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
          </>
        )}
      </React.Fragment>
    );
  } else if (props.products.length !== 0) {
    return (
      <React.Fragment>
        <Grid container spacing={4} className={classes.gridContainer}>
          {products.map((loadedProduct, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductItem
                title={loadedProduct.name}
                price={loadedProduct.price}
                id={loadedProduct._id}
              />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  } else if (props.products.length === 0) {
    return (
      <React.Fragment>
        <div>This collection is empty</div>
      </React.Fragment>
    );
  }
}
