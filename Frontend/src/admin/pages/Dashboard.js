import React, { useState, useEffect, useContext } from "react";
import { Button, Grid, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/ErrorModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 3,
};

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState();
  const [productTypes, setProductTypes] = useState();
  const [error, setError] = useState();
  const [buyers, setBuyers] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [sellers, setSellers] = useState();
  const [activeOrder, setActiveOrder] = useState();

  const [openOrder, setOpenOrder] = React.useState(false);
  const handleOpenOrder = (order) => {
    setActiveOrder(order);
    setOpenOrder(true);
  };
  const handleCloseOrder = () => setOpenOrder(false);

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/producttypes`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setProductTypes(responseData.productTypes);
    } catch (err) {
      //setError(err.message);
    }
    try {
      const response = await fetch(`http://localhost:5000/sellers`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setSellers(responseData.sellers);
    } catch (err) {
      //setError(err.message);
    }
    try {
      const response = await fetch(`http://localhost:5000/buyers`, {
        headers: {
          Authorization: "Bearer " + auth.token,
        },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setBuyers(responseData.buyers);
    } catch (err) {
      //setError(err.message);
    }
    try {
      const response = await fetch(`http://localhost:5000/orders`);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setOrders(responseData.orders);
    } catch (err) {
      //setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sendRequest();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    handleClose();
    try {
      const response = await fetch(`http://localhost:5000/productTypes/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: data.get("productType"),
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
    sendRequest();
  };

  const errorHandler = () => {
    setError(null);
  };

  async function removeBuyerHandler(buyerId) {
    try {
      const response = await fetch(`http://localhost:5000/buyers/${buyerId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      } else {
        setError(responseData.message || "Something went wrong");
      }
    } catch (err) {}
    sendRequest();
  }

  async function removeSellerHandler(sellerId) {
    try {
      const response = await fetch(
        `http://localhost:5000/sellers/${sellerId}`,
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
        setError(responseData.message || "Something went wrong");
      } else {
        setError(responseData.message || "Something went wrong");
      }
    } catch (err) {}
    sendRequest();
  }

  async function removeProductTypeHandler(productTypeId) {
    try {
      const response = await fetch(
        `http://localhost:5000/productTypes/${productTypeId}`,
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
        setError(responseData.message || "Something went wrong");
      } else {
        setError(responseData.message || "Something went wrong");
      }
    } catch (err) {}
    sendRequest();
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <div>Loading</div>}
      {!isLoading && productTypes && buyers && orders && (
        <Grid container sx={{ ml: 3, mt: 3 }}>
          <Grid sx={{ ml: 3, mt: 3, mb: 3, mr: 3 }} item xs={4}>
            <Typography variant="h3">Product types</Typography>
            <List>
              {productTypes.map((type, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        removeProductTypeHandler(type._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {type.type}
                </ListItem>
              ))}
            </List>
            <Button onClick={handleOpen}>Add Product Type</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography
                  sx={{ mb: 2 }}
                  align="center"
                  variant="h6"
                  component="h2"
                >
                  Enter product type
                </Typography>
                <TextField
                  label="Product type"
                  name="productType"
                  variant="standard"
                />
                <Button variant="outlined" color="success" type="submit">
                  Add
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </Grid>
          <Grid sx={{ ml: 3, mt: 3, mb: 3, mr: 3 }} item xs={4}>
            <Typography variant="h3">Buyers</Typography>
            <List>
              {buyers.map((buyer, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        removeBuyerHandler(buyer._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {buyer.name}
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item sx={{ ml: 3, mt: 3, mb: 3, mr: 3 }} xs={4}>
            <Typography variant="h3">Sellers</Typography>
            <List>
              {sellers.map((seller, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        removeSellerHandler(seller._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {seller.brandName}
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid sx={{ ml: 3, mt: 3, mb: 3, mr: 3 }} item xs={7}>
            <Typography variant="h3">Orders </Typography>
            <List
              sx={{
                maxHeight: 300,
                position: "relative",
                overflow: "auto",
              }}
            >
              {orders.map((order, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    onClick={() => handleOpenOrder(order)}
                    alignItems="flex-start"
                  >
                    <ListItemText
                      primary={`Order ID: ${order._id}`}
                      secondary={`Price : ${order.totalPrice}rsd, Paid: ${order.paid}`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
              {activeOrder && (
                <Modal
                  open={openOrder}
                  onClose={handleCloseOrder}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography variant="h5">
                      Order ID: {activeOrder._id}
                    </Typography>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      Buyer: {activeOrder.buyer.name}{" "}
                      {activeOrder.buyer.lastName}
                      {`\n`}
                      Address: {activeOrder.address}, floor: {activeOrder.floor}
                      {`\n`}
                      City: {activeOrder.city}, {activeOrder.postalCode}
                      {`\n`}
                      Order price: {activeOrder.totalPrice}
                    </Typography>

                    <Button onClick={handleCloseOrder}>Close</Button>
                  </Box>
                </Modal>
              )}
            </List>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}
