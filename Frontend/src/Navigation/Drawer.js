import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function SideMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Shopper</Typography>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <Box p={2} width="250px" textAlign="center" role="presentation">
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Shopper
              </Typography>
            </Box>
            <Divider />
            <List>
              {["Products", "Sellers", "Login"].map((text, index) => (
                <Link
                  onClick={() => setIsDrawerOpen(false)}
                  to={`/${text}`}
                  key={text}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
