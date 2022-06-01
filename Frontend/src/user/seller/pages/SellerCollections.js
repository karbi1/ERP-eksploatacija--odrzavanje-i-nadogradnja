import { Grid } from "@mui/material";
import Collection from "./../../../Collection";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useStyles = makeStyles({
  gridContainer: {
    paddingLeft: "30px",
    paddingRight: "20px",
    paddingTop: "15px",
  },
});

export default function SellerCollections(props) {
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const [loadedCollections, setLoadedCollections] = useState();
  const params = useParams();

  const classes = useStyles();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/collections/seller/${params.id}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedCollections(responseData.collections);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, [params]);

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
      {!isLoading && loadedCollections && (
        <Grid container spacing={4} className={classes.gridContainer}>
          {loadedCollections.map((loadedCollection, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Collection
                name={loadedCollection.name}
                created={loadedCollection.created}
                id={loadedCollection._id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
}
