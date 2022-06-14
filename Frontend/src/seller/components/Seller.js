import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function Seller(props) {
  return (
    <Card sx={{ width: 350, height: 450 }} variant="outlined">
      <CardActionArea component={Link} to={`/sellers/${props.id}/collections`}>
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
          <Typography
            align="center"
            gutterBottom
            variant="body"
            component="div"
          >
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
