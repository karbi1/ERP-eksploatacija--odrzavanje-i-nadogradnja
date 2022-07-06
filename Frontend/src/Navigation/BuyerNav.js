import React, { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { AuthContext } from "../shared/context/auth-context";

export default function BuyerNav() {
  const auth = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loadedBuyer, setLoadedBuyer] = useState();
  const [isLoading, setIsLoading] = useState();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/buyers/${auth.userId}`,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedBuyer(responseData.buyer);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {!isLoading && loadedBuyer && (
        <>
          <Link to="/cart">
            <Button style={{ color: "white" }}>
              <ShoppingCartIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
            </Button>
          </Link>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={loadedBuyer.image} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link
                to="account"
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem key={"account"} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
              </Link>
              <Link
                to="orders"
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem key={"orders"} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Orders</Typography>
                </MenuItem>
              </Link>

              <Link
                onClick={auth.logout}
                to="/"
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem key={"logout"} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Log out</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        </>
      )}
    </React.Fragment>
  );
}
