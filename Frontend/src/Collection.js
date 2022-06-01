import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function Collection(props) {
  return (
    <Card sx={{ maxWidth: 200 }} variant="outlined">
      <CardActionArea component={Link} to={`/products/${props.id}`}>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.name}
          </Typography>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.created}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
