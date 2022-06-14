import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";

export default function CartItem(props) {
  const auth = useContext(AuthContext);
  const { onRemove } = props;

  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Box
          component="img"
          sx={{
            height: 133,
            width: 200,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt="The house from the offer."
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
        />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5">{props.product.name}</Typography>
        <div>Size: {props.size}</div>
        <div>Amount: {props.amount}</div>
      </Grid>
      <Grid item xs={1}>
        <div>Price: {props.price}rsd</div>
      </Grid>
      <Grid item xs={1}>
        <div>Total: {props.price * props.amount}rsd </div>
      </Grid>
      <Grid item xs={1}>
        <Link to="/cart">
          <Button
            onClick={(e) => {
              props.onRemove(props.cartItemId);
            }}
          >
            <DeleteIcon />
          </Button>
        </Link>
      </Grid>
    </React.Fragment>
  );
}
