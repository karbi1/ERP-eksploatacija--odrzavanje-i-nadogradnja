import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";

import SellerSignUp from "./SellerSignUp";
import BuyerSignUp from "./BuyerSignUp";

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const [userType, setUserType] = useState("Buyer");

  return (
    <React.Fragment>
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FormLabel id="demo-row-radio-buttons-group-label">
          Type of user
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="userType"
          required
          defaultValue="Buyer"
        >
          <FormControlLabel
            onClick={() => setUserType("Buyer")}
            value="Buyer"
            control={<Radio />}
            label="Buyer"
          />
          <FormControlLabel
            onClick={() => setUserType("Seller")}
            value="Seller"
            control={<Radio />}
            label="Seller"
          />
        </RadioGroup>
      </Box>
      {userType === "Seller" ? <SellerSignUp /> : <BuyerSignUp />}
    </React.Fragment>
  );
}
