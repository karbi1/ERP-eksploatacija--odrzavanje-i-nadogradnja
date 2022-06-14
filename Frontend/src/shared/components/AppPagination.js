import React, { useState } from "react";
import { Pagination } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "secondary",
  },
  root: {
    position: "fixed",
    bottom: 0,
    zIndex: 200,

    padding: "10px 80px",
    color: "secondary",
    width: "100%",
  },
}));

const AppPagination = ({ productsPerPage, totalProducts, setPage }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.root}>
        {" "}
        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          variant="contained"
          color="secondary"
        />
      </div>
    </div>
  );
};

export default AppPagination;
