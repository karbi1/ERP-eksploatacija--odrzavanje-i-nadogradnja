import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 3,
};

const ErrorModal = (props) => {
  return (
    <Modal onClose={props.onClear} open={!!props.error}>
      <Box sx={style}>
        <p>{props.error}</p>
        <Button onClick={props.onClear}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
