import React, { useState, useRef } from "react";
import { Button } from "@mui/material";

export default function ImageUpload(props) {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
  };

  return (
    <div>
      <Button>
        <input
          type="file"
          id={props.id}
          accept=".jpg, .png, .jpeg"
          onChange={pickedHandler}
        />
      </Button>
    </div>
  );
}
