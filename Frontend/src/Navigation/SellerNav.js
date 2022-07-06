import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

import { AuthContext } from "../shared/context/auth-context";

export default function SellerNav() {
  const auth = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loadedSeller, setLoadedSeller] = useState();
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
          `http://localhost:5000/sellers/${auth.userId}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedSeller(responseData.seller);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {!isLoading && loadedSeller && (
        <>
          <Box>
            <Link to="/create-collection">
              <Button
                color="secondary"
                variant="contained"
                sx={{
                  my: 2,
                  mr: 2,
                  display: "block",
                }}
              >
                Create collection
              </Button>
            </Link>
          </Box>
          <Box>
            <Link to="/create-product">
              <Button
                color="secondary"
                variant="contained"
                sx={{
                  my: 2,
                  mr: 2,
                  display: "block",
                }}
              >
                Create product
              </Button>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={loadedSeller.image} />
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
                to={`sellers/${auth.userId}/collections`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem key={"orders"} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Collections</Typography>
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
