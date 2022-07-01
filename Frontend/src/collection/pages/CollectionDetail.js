import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductList from "../../product/pages/ProductList";

export default function CollectionDetail() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/collections/${params.collectionId}/products`
        );
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
  }, [params]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <h1>loading</h1>
        </div>
      )}
      {isLoading && (
        <div>
          <h1>Loading</h1>
        </div>
      )}
      {!isLoading && loadedProducts && (
        <>
          <Typography variant="h1" sx={{ ml: 4, mt: 2 }}>
            {loadedProducts[0].collectionName.name}
          </Typography>
          <hr />
          <ProductList products={loadedProducts} />
        </>
      )}
    </React.Fragment>
  );
}
