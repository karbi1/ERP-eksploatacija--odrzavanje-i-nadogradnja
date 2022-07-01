import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ReactPaginate from "react-paginate";
import Pagination from "@mui/material/Pagination";

import ProductItem from "../components/ProductItem";

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
  const [productType, setProductType] = useState("");
  const [productTypes, setProductTypes] = useState();
  const [sortBy, setSortBy] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

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
    } catch (err) {
      console.log("error fetching products");
    }
    try {
      const response2 = await fetch("http://localhost:5000/productTypes");
      const responseData2 = await response2.json();
      if (!response2.ok) {
        throw new Error(responseData2.message);
      }
      setProductTypes(responseData2.productTypes);
    } catch (err) {
      console.log("error fetching product types");
    }
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

  const handleFilterChange = (event) => {
    setProductType(event.target.value);
  };

  const handleSortProducts = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterProducts = (value) => {
    setIsLoading(true);
    setLoadedProducts(
      permanentProducts.filter((prod) => prod.productType.type === value)
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
            <Box sx={{ mt: 2, ml: 4, mb: 1, mr: 1 }}>
              <FormControl>
                <InputLabel>Sort by</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  name="sort"
                  value={sortBy}
                  label="Sort by"
                  onChange={handleSortProducts}
                >
                  <MenuItem
                    key="0"
                    value="ascending"
                    onClick={handleSortPriceAscending}
                  >
                    $-$$
                  </MenuItem>
                  <MenuItem
                    key="1"
                    value="descending"
                    onClick={handleSortPriceDescending}
                  >
                    $$-$
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ ml: 2 }}>
                <InputLabel>Filter by</InputLabel>
                <Select
                  sx={{ width: 150 }}
                  name="filter"
                  label="Filter by"
                  value={productType}
                  onChange={handleFilterChange}
                >
                  {productTypes.map((type, index) => (
                    <MenuItem
                      key={index}
                      value={type.type}
                      onClick={() => {
                        handleFilterProducts(type.type);
                      }}
                    >
                      {type.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                sx={{ mt: 1, ml: 2 }}
                variant="contained"
                color="grey"
                onClick={() => {
                  setLoadedProducts(permanentProducts);
                }}
              >
                Reset filter
              </Button>
              <input
                type="text"
                placeholder="search"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </Box>

            <Grid container spacing={4} className={classes.gridContainer}>
              {loadedProducts
                .filter((val) => {
                  if (searchTerm === "") {
                    return val;
                  } else if (
                    val.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((loadedProduct, index) => (
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
