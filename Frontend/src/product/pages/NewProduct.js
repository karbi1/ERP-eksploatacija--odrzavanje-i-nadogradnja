import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FileBase64 from "react-file-base64";
import axios from "axios";

import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/ImageUpload";
import ErrorModal from "../../shared/components/ErrorModal";

const theme = createTheme();

export default function NewProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState();
  const [type, setType] = React.useState("");
  const [collection, setCollection] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState();
  const [item, setItem] = useState();
  const [sellerCollections, setSellerCollections] = useState();

  useEffect(() => {
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
        const response = await fetch(
          `http://localhost:5000/collections/seller/${auth.userId}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setSellerCollections(responseData.collections);
      } catch (err) {
        //setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const data = new FormData(event.currentTarget);

    let id;
    try {
      const imgData = new FormData();
      console.log(data.get("image"));
      imgData.append("image", data.get("image"));
      imgData.append("seller", auth.userId);
      imgData.append("collectionName", data.get("collectionName"));
      imgData.append("productType", data.get("productType"));
      imgData.append("description", data.get("description"));
      imgData.append("price", data.get("price"));
      imgData.append("name", data.get("name"));
      imgData.append("gender", data.get("gender"));
      imgData.append("s", data.get("s"));
      imgData.append("l", data.get("l"));
      imgData.append("m", data.get("m"));
      imgData.append("xl", data.get("xl"));

      const response = await fetch(`http://localhost:5000/products/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token,

          "Content-Type": "application/json",
        },
        body: imgData,
        /*JSON.stringify({
          seller: auth.userId,
          collectionName: data.get("collectionName"),
          productType: data.get("productType"),
          description: data.get("description"),
          price: data.get("price"),
          name: data.get("name"),
          gender: data.get("gender"),
          s: data.get("s"),
          m: data.get("m"),
          l: data.get("l"),
          xl: data.get("xl"),
          image: imgData,
        }),*/
      });

      //axios.post("http://localhost:5000/products/");

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
      } else {
        id = responseData.product._id;
        window.location.href = `/products/${id}`;
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleCollectionChange = (event) => {
    setCollection(event.target.value);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const imageHandler = (event) => {
    setItem(event.target.files[0]);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <div>Loading</div>}
      {!isLoading && productTypes && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <CheckroomIcon fontSize="large" />
            <Typography component="h1" variant="h3">
              New product
            </Typography>
          </Box>
          <Box
            sx={{ ml: 6, mr: 6, mt: 3, mb: 3 }}
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Product name"
              name="name"
              autoFocus
              sx={{ mt: 2 }}
            />
            <TextField
              id="description"
              label="Description"
              name="description"
              multiline
              fullWidth
              required
              rows={3}
              placeholder="Description"
              sx={{ mt: 2 }}
            />

            <input name="image" onChange={imageHandler} type="file" />
            <InputLabel sx={{ mt: 2 }}>Product type</InputLabel>
            <Select
              fullWidth
              label="productType"
              name="productType"
              value={type}
              onChange={handleTypeChange}
            >
              {productTypes.map((type, index) => (
                <MenuItem key={index} value={type._id}>
                  {type.type}
                </MenuItem>
              ))}
            </Select>
            <InputLabel sx={{ mt: 2 }}>Collection</InputLabel>
            <Select
              label="collection"
              name="collectionName"
              value={collection}
              fullWidth
              onChange={handleCollectionChange}
            >
              {sellerCollections.map((collection, index) => (
                <MenuItem key={index} value={collection._id}>
                  {collection.name}
                </MenuItem>
              ))}
            </Select>
            <InputLabel sx={{ mt: 2 }}>Gender</InputLabel>
            <Select
              label="gender"
              value={gender}
              name="gender"
              fullWidth
              onChange={handleGenderChange}
            >
              <MenuItem key="man" value="Man">
                Man
              </MenuItem>
              <MenuItem key="woman" value="Woman">
                Woman
              </MenuItem>
              <MenuItem key="unisex" value="Unisex">
                Unisex
              </MenuItem>
            </Select>
            <TextField
              required
              id="price"
              label="Price"
              name="price"
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ mt: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  required
                  id="s"
                  label="S"
                  name="s"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  id="m"
                  label="M"
                  name="m"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  id="l"
                  label="L"
                  name="l"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  id="xl"
                  label="XL"
                  name="xl"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
            <Button
              size="large"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              type="submit"
            >
              Create product
            </Button>
          </Box>
        </ThemeProvider>
      )}
    </React.Fragment>
  );
}
