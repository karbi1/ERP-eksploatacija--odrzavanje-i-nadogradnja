import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";

import ResponsiveAppBar from "./Nav";
import Drawer from "./Drawer";

const Header = () => {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      {isMatch && <Drawer />}
      {!isMatch && <ResponsiveAppBar />}
    </React.Fragment>
  );
};

export default Header;
