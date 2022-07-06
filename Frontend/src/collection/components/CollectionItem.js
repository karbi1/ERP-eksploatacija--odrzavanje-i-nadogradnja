import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";

export default function Collection(props) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/collections/${props.collectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      } else {
        console.log(responseData);
      }
    } catch (err) {
      console.log(err.message);
    }
    window.location.href = `http://localhost:3000/sellers/${props.seller}/collections`;
  };

  const auth = useContext(AuthContext);

  return (
    <Card sx={{ maxWidth: 200 }} variant="outlined">
      <CardActionArea
        component={Link}
        to={`/sellers/${props.sellerId}/collections/${props.collectionId}`}
      >
        <CardMedia
          component="img"
          height="140"
          image={props.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.name}
          </Typography>
          <Typography align="center" gutterBottom variant="h6" component="div">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {(auth.userId === props.sellerId || auth.role === "Admin") && (
        <>
          <Link to={`/edit/collection/${props.collectionId}`}>
            <Button color="secondary">Edit collection</Button>
          </Link>
          <Button onClick={handleDelete} color="error">
            Delete collection
          </Button>
        </>
      )}
    </Card>
  );
}
