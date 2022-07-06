import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function ProductItem(props) {
  return (
    <Card sx={{ maxWidth: 200 }} variant="outlined">
      <CardActionArea component={Link} to={`/products/${props.id}`}>
        <CardMedia
          component="img"
          height="140"
          image={props.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.title}
          </Typography>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
